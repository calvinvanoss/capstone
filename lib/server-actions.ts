'use server';

import { Project } from '@/types/project';
import { db } from '@/lib/db/drizzle';
import {
  documents,
  projects,
  userProjectPermissions,
  users,
} from '@/lib/db/schema';
import { and, eq, isNull } from 'drizzle-orm';
import { YooptaContentValue } from '@yoopta/editor';
import { auth } from '@/auth';

/* NAMING CONVENTION:
slugs: string[] => array of slugs
path: string => slugs joined by '/'
*/

export async function getProjects() {
  const session = await auth();
  if (!session || !session.user) throw new Error('Session not found');
  const user = session.user;
  if (!user || !user.id) throw new Error('User not found');

  const res = await db
    .select()
    .from(projects)
    .where(eq(userProjectPermissions.userId, user.id))
    .leftJoin(
      userProjectPermissions,
      eq(userProjectPermissions.projectId, projects.id)
    );

  return res;
}

export async function getProject(projectId: number) {
  const session = await auth();
  if (!session || !session.user) throw new Error('Session not found');
  const user = session.user;
  if (!user || !user.id) throw new Error('User not found');

  const permissions = await db
    .select()
    .from(userProjectPermissions)
    .where(
      and(
        eq(userProjectPermissions.userId, user.id),
        eq(userProjectPermissions.projectId, projectId)
      )
    );
  if (permissions.length === 0) throw new Error('Permission denied');

  const res = await db
    .select()
    .from(projects)
    .where(eq(projects.id, projectId));
  if (res.length !== 1) throw new Error('Project not found');

  return res[0];
}

export async function createProject(name: string, description?: string) {
  const session = await auth();
  if (!session || !session.user) throw new Error('Session not found');
  const user = session.user;
  if (!user || !user.id) throw new Error('User not found');

  const res = await db
    .insert(projects)
    .values({
      name,
      description,
    })
    .returning({ id: projects.id });

  if (res.length === 1) {
    await postDocument(res[0].id);
    await db.insert(userProjectPermissions).values({
      userId: user.id,
      projectId: res[0].id,
      role: 'admin',
    });
  }

  return res;
}

export async function deleteProject(projectId: number) {
  await db.delete(projects).where(eq(projects.id, projectId));
}

export async function postDocument(projectId: number, path?: string) {
  await db.insert(documents).values({
    projectId,
    path,
  });
}

export async function putProject(project: Project) {
  await db
    .update(projects)
    .set({
      description: project.description,
      name: project.name,
      children: project.children,
    })
    .where(eq(projects.id, project.id));
}

export async function getDocument(projectId: number, path?: string) {
  const session = await auth();
  if (!session || !session.user) throw new Error('Session not found');
  const user = session.user;
  if (!user || !user.id) throw new Error('User not found');

  const permissions = await db
    .select()
    .from(userProjectPermissions)
    .where(
      and(
        eq(userProjectPermissions.userId, user.id),
        eq(userProjectPermissions.projectId, projectId)
      )
    );
  if (permissions.length === 0) throw new Error('Permission denied');

  const res = await db
    .select()
    .from(documents)
    .where(
      and(
        eq(documents.projectId, projectId),
        path ? eq(documents.path, path) : isNull(documents.path)
      )
    );
  if (res.length !== 1) throw new Error('Document not found');

  return res[0];
}

export async function updateDocument(
  projectId: number,
  path: string,
  content: YooptaContentValue
) {
  await db
    .update(documents)
    .set({
      content,
    })
    .where(
      and(
        eq(documents.projectId, projectId),
        path ? eq(documents.path, path) : isNull(documents.path)
      )
    );
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
