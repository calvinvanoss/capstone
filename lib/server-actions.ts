'use server';

import { Project } from '@/types/project';
import { db } from '@/db/db';
import { documents, projects } from '@/db/schema';
import { and, eq, isNull } from 'drizzle-orm';
import { YooptaContentValue } from '@yoopta/editor';

/* NAMING CONVENTION:
slugs: string[] => array of slugs
path: string => slugs joined by '/'
*/

// TODO: merge with getProject after migrate auth to neon, make projectId optional
export async function getProjects() {
  const res = await db.select().from(projects);

  return res;
}

export async function getProject(projectId: number) {
  const res = await db
    .select()
    .from(projects)
    .where(eq(projects.id, projectId));
  if (res) {
    return res[0];
  }

  return null;
}

export async function createProject(name: string, description?: string) {
  const res = await db
    .insert(projects)
    .values({
      name,
      description,
    })
    .returning({ id: projects.id });

  if (res) {
    await postDocument(res[0].id);
  }

  return res;
}

export async function deleteProject(projectId: number) {
  const res = await db.delete(projects).where(eq(projects.id, projectId));
}

export async function postDocument(projectId: number, path?: string) {
  const res = await db.insert(documents).values({
    projectId,
    path,
  });
}

export async function putProject(project: Project) {
  const res = await db
    .update(projects)
    .set({
      description: project.description,
      name: project.name,
      children: project.children,
    })
    .where(eq(projects.id, project.id));
}

export async function getDocument(projectId: number, path?: string) {
  const res = await db
    .select()
    .from(documents)
    .where(
      and(
        eq(documents.projectId, projectId),
        path ? eq(documents.path, path) : isNull(documents.path)
      )
    );

  if (res) {
    return res[0];
  }

  return null;
}

export async function updateDocument(
  projectId: number,
  path: string,
  content: YooptaContentValue
) {
  const res = await db
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
