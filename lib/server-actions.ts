'use server';

import { Tree } from '@/lib/types';
import { db } from '@/lib/db/drizzle';
import {
  contentBlocks,
  docNodes,
  permissions,
  projects,
  users,
  versions,
} from '@/lib/db/schema';
import { aliasedTable, and, eq, isNull } from 'drizzle-orm';
import { YooptaContentValue } from '@yoopta/editor';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

// TODO: refactor to use transactions
export async function shareProject(
  projectId: number,
  email: string,
  role: 'admin' | 'editor' | 'viewer'
) {
  const user = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email));

  if (user.length !== 1) throw new Error('User not found');

  await db
    .insert(permissions)
    .values({
      userId: user[0].id,
      projectId,
      role,
    })
    .onConflictDoUpdate({
      target: [permissions.projectId, permissions.userId],
      set: { role },
    });

  if (role === 'admin' || role === 'editor') {
    const latestVersion = await db
      .select({
        latestChildren: versions.children,
        latestVersionId: versions.id,
      })
      .from(versions)
      .where(
        and(
          eq(projects.currentVersionCount, versions.versionCount),
          eq(projects.id, projectId)
        )
      )
      .innerJoin(projects, eq(projects.id, versions.projectId));

    const newVersion = await db
      .insert(versions)
      .values({
        versionCount: -1,
        children: latestVersion[0].latestChildren,
        parentVersionId: latestVersion[0].latestVersionId,
        projectId,
        userId: user[0].id,
      })
      .returning({ id: versions.id });

    const latestNodes = await db
      .select()
      .from(docNodes)
      .where(eq(docNodes.versionId, latestVersion[0].latestVersionId));

    await db.insert(docNodes).values(
      latestNodes.map((node) => ({
        versionId: newVersion[0].id,
        contentBlockId: node.contentBlockId,
      }))
    );
  }
}

export async function pullLatestVersion(projectId: number, versionId: number) {
  const session = await auth();
  if (!session || !session.user) throw new Error('Session not found');
  const user = session.user;
  if (!user || !user.id) throw new Error('User not found');

  await db.delete(versions).where(eq(versions.id, versionId));

  const latestVersion = await db
    .select({ latestChildren: versions.children, latestVersionId: versions.id })
    .from(versions)
    .where(
      and(
        eq(projects.currentVersionCount, versions.versionCount),
        eq(projects.id, projectId)
      )
    )
    .innerJoin(projects, eq(projects.id, versions.projectId));

  const newVersion = await db
    .insert(versions)
    .values({
      versionCount: -1,
      children: latestVersion[0].latestChildren,
      parentVersionId: latestVersion[0].latestVersionId,
      projectId,
      userId: user.id,
    })
    .returning({ id: versions.id });

  const latestNodes = await db
    .select()
    .from(docNodes)
    .where(eq(docNodes.versionId, latestVersion[0].latestVersionId));

  await db.insert(docNodes).values(
    latestNodes.map((node) => ({
      versionId: newVersion[0].id,
      contentBlockId: node.contentBlockId,
      path: node.path,
    }))
  );

  redirect(`/${newVersion[0].id}`);
}

export async function pushVersion(
  projectId: number,
  versionId: number,
  currentVersion: number
) {
  const session = await auth();
  if (!session || !session.user) throw new Error('Session not found');
  const user = session.user;
  if (!user || !user.id) throw new Error('User not found');

  const latestVersion = await db
    .update(versions)
    .set({ versionCount: currentVersion + 1, userId: null })
    .where(eq(versions.id, versionId))
    .returning({
      latestVersionChildren: versions.children,
      latestVersionId: versions.id,
    });

  await db
    .update(projects)
    .set({ currentVersionCount: currentVersion + 1 })
    .where(eq(projects.id, projectId));

  const newVersion = await db
    .insert(versions)
    .values({
      versionCount: -1,
      children: latestVersion[0].latestVersionChildren,
      parentVersionId: latestVersion[0].latestVersionId,
      projectId,
      userId: user.id,
    })
    .returning({ id: versions.id });

  const latestNodes = await db
    .select()
    .from(docNodes)
    .where(eq(docNodes.versionId, latestVersion[0].latestVersionId));

  await db.insert(docNodes).values(
    latestNodes.map((node) => ({
      versionId: newVersion[0].id,
      contentBlockId: node.contentBlockId,
      path: node.path,
    }))
  );

  redirect(`/${latestVersion[0].latestVersionId}`);
}

export async function fetchProjects() {
  const session = await auth();
  if (!session || !session.user) throw new Error('Session not found');
  const user = session.user;
  if (!user || !user.id) throw new Error('User not found');

  const userVersion = aliasedTable(versions, 'user_version');
  const currentVersion = aliasedTable(versions, 'current_version');

  const res = await db
    .select({
      id: projects.id,
      name: projects.name,
      description: projects.description,
      currentVersion: projects.currentVersionCount,
      role: permissions.role,
      userVersionId: userVersion.id,
      currentVersionId: currentVersion.id,
    })
    .from(projects)
    .innerJoin(
      permissions,
      and(
        eq(permissions.projectId, projects.id),
        eq(permissions.userId, user.id)
      )
    )
    .leftJoin(
      userVersion,
      and(
        eq(userVersion.projectId, projects.id),
        eq(userVersion.userId, user.id)
      )
    )
    .leftJoin(
      currentVersion,
      and(
        eq(currentVersion.projectId, projects.id),
        eq(currentVersion.versionCount, projects.currentVersionCount)
      )
    )
    .where(eq(permissions.userId, user.id))
    .execute();

  return res;
}

export async function getVersion(versionId: number) {
  const session = await auth();
  if (!session || !session.user) throw new Error('Session not found');
  const user = session.user;
  if (!user || !user.id) throw new Error('User not found');

  const res = await db
    .select({
      versionId: versions.id,
      versionCount: versions.versionCount,
      children: versions.children,
      parentVersionId: versions.parentVersionId,
      versionUserId: versions.userId,
      projectId: versions.projectId,
      projectName: projects.name,
      currentVersionCount: projects.currentVersionCount,
    })
    .from(versions)
    .where(eq(versions.id, versionId))
    .leftJoin(projects, eq(projects.id, versions.projectId));

  if (res.length !== 1) throw new Error('Project not found');

  return res[0];
}

export async function createProject(name: string, description?: string) {
  const session = await auth();
  if (!session || !session.user) throw new Error('Session not found');
  const user = session.user;
  if (!user || !user.id) throw new Error('User not found');

  const projectRes = await db
    .insert(projects)
    .values({
      name,
      currentVersionCount: 0,
      description,
    })
    .returning({ id: projects.id });

  await db.insert(permissions).values({
    userId: user.id,
    projectId: projectRes[0].id,
    role: 'admin',
  });

  // create initial version
  const initVersionRes = await db
    .insert(versions)
    .values({
      versionCount: 0,
      projectId: projectRes[0].id,
      parentVersionId: 0, // 0 for root
    })
    .returning({ id: versions.id });
  const blockContentRes = await db
    .insert(contentBlocks)
    .values({
      parentVersionId: initVersionRes[0].id,
      projectId: projectRes[0].id,
    })
    .returning({ id: contentBlocks.id });
  await db.insert(docNodes).values({
    versionId: initVersionRes[0].id,
    contentBlockId: blockContentRes[0].id,
  });

  // create user branch
  const branchVersionRes = await db
    .insert(versions)
    .values({
      versionCount: -1,
      parentVersionId: initVersionRes[0].id,
      projectId: projectRes[0].id,
      userId: user.id,
    })
    .returning({ id: versions.id });
  await db.insert(docNodes).values({
    versionId: branchVersionRes[0].id,
    contentBlockId: blockContentRes[0].id,
  });

  return true;
}

export async function deleteProject(projectId: number) {
  await db.delete(projects).where(eq(projects.id, projectId));
}

export async function createDoc(
  projectId: number,
  versionId: number,
  path?: string
) {
  const contentBlock = await db
    .insert(contentBlocks)
    .values({
      parentVersionId: versionId,
      projectId,
    })
    .returning({ id: contentBlocks.id });

  await db.insert(docNodes).values({
    versionId,
    path,
    contentBlockId: contentBlock[0].id,
  });
}

export async function updateVersionTree(versionId: number, tree: Tree) {
  await db
    .update(versions)
    .set({ children: tree })
    .where(eq(versions.id, versionId));
}

export async function getDocContent(versionId: number, path?: string) {
  const session = await auth();
  if (!session || !session.user) throw new Error('Session not found');
  const user = session.user;
  if (!user || !user.id) throw new Error('User not found');

  const res = await db
    .select({ content: contentBlocks.content })
    .from(docNodes)
    .where(
      and(
        eq(docNodes.versionId, versionId),
        path ? eq(docNodes.path, path) : isNull(docNodes.path)
      )
    )
    .leftJoin(contentBlocks, eq(docNodes.contentBlockId, contentBlocks.id));

  return res[0];
}

export async function updateDocContent(
  versionId: number,
  path: string,
  content: YooptaContentValue
) {
  const blockContentRes = await db
    .select({
      parentVersionId: contentBlocks.parentVersionId,
      blockContentId: contentBlocks.id,
      projectId: contentBlocks.projectId,
      docNodeId: docNodes.id,
    })
    .from(docNodes)
    .where(
      and(
        eq(docNodes.versionId, versionId),
        path ? eq(docNodes.path, path) : isNull(docNodes.path)
      )
    )
    .leftJoin(contentBlocks, eq(docNodes.contentBlockId, contentBlocks.id));

  if (blockContentRes[0].parentVersionId === versionId) {
    await db
      .update(contentBlocks)
      .set({ content })
      .where(eq(contentBlocks.id, blockContentRes[0].blockContentId!));
  } else {
    const newBlockContentRes = await db
      .insert(contentBlocks)
      .values({
        projectId: blockContentRes[0].projectId!,
        parentVersionId: versionId,
        content,
      })
      .returning({ id: contentBlocks.id });

    await db
      .update(docNodes)
      .set({ contentBlockId: newBlockContentRes[0].id })
      .where(eq(docNodes.id, blockContentRes[0].docNodeId));
  }

  return true;
}

export async function putProject(
  projectId: number,
  name?: string,
  description?: string
) {
  await db
    .update(projects)
    .set({
      name,
      description,
    })
    .where(eq(projects.id, projectId));
}

export async function authorizeCredentials(username: string) {
  const user = await db
    .insert(users)
    .values({
      name: username,
      email: username,
    })
    .onConflictDoUpdate({ target: users.email, set: { email: username } })
    .returning({ id: users.id, name: users.name, email: users.email });

  if (user.length !== 1) throw new Error('User not found');

  return user[0];
}
