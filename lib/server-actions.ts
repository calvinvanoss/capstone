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
import { and, eq, isNull } from 'drizzle-orm';
import { YooptaContentValue } from '@yoopta/editor';
import { auth } from '@/auth';

/* NAMING CONVENTION:
slugs: string[] => array of slugs
path: string => slugs joined by '/'
*/

export async function fetchProjects() {
  const session = await auth();
  if (!session || !session.user) throw new Error('Session not found');
  const user = session.user;
  if (!user || !user.id) throw new Error('User not found');

  const res = await db
    .select({
      id: projects.id,
      name: projects.name,
      description: projects.description,
      currentVersion: projects.currentVersion,
      role: permissions.role,
      versionId: versions.id,
    })
    .from(projects)
    .where(eq(permissions.userId, user.id))
    .leftJoin(permissions, eq(permissions.projectId, projects.id))
    .leftJoin(
      versions,
      and(eq(versions.projectId, projects.id), eq(versions.userId, user.id))
    );

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
      version: versions.version,
      children: versions.children,
      parentVersionId: versions.parentVersionId,
      userId: versions.userId,
      projectId: versions.projectId,
      projectName: projects.name,
    })
    .from(versions)
    .where(and(eq(versions.userId, user.id), eq(versions.id, versionId)))
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
      currentVersion: '0.0.0',
      description,
    })
    .returning({ id: projects.id });

  await db.insert(permissions).values({
    userId: user.id,
    projectId: projectRes[0].id,
    role: 'admin',
  });

  const versionRes = await db
    .insert(versions)
    .values({
      version: '0.0.0',
      projectId: projectRes[0].id,
      userId: user.id,
    })
    .returning({ id: versions.id });

  const blockContentRes = await db
    .insert(contentBlocks)
    .values({
      parentVersionId: versionRes[0].id,
      projectId: projectRes[0].id,
    })
    .returning({ id: contentBlocks.id });

  await db.insert(docNodes).values({
    versionId: versionRes[0].id,
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
