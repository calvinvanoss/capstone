'use server';

import { Project } from '@/types/project';
import { cookiesClient } from './amplify-utils';

/* NAMING CONVENTION:
slugs: string[] => array of slugs
path: string => slugs joined by '/'
*/

export async function getProject(projectId: string) {
  const { data, errors } = await cookiesClient.models.Project.get({
    id: projectId,
  });

  if (errors) {
    console.error('error:', errors);
  }

  return data;
}

export async function createProject(name: string, description?: string) {
  const { data: projectData, errors: projectErrors } =
    await cookiesClient.models.Project.create({
      name,
      description,
      children: '[]',
    });

  if (projectData) {
    const { data, errors } = await cookiesClient.models.Document.create({
      projectId: projectData.id,
      path: '/',
      content: '',
    });

    if (errors) {
      console.error('error:', errors);
    }
  }

  if (projectErrors) {
    console.error('error:', projectErrors);
  }
}

// TODO: on delete project, cascade delete documents
export async function deleteProject(projectId: string) {
  const { data, errors } = await cookiesClient.models.Project.delete({
    id: projectId,
  });

  if (errors) {
    console.error('error:', errors);
    throw new Error('Failed to delete project');
  }

  return data;
}

export async function postDocument(projectId: string, path: string) {
  const { data, errors } = await cookiesClient.models.Document.create({
    projectId,
    path,
    content: '',
  });

  if (errors) {
    console.error('error:', errors);
  }
}

export async function putProject(project: Project) {
  const { data, errors } = await cookiesClient.models.Project.update({
    id: project.id,
    description: project.description,
    name: project.name,
    children: JSON.stringify(project.children),
  });

  if (errors) {
    console.error('error:', errors);
  }
}

export async function getContent(projectId: string, path: string) {
  const { data, errors } = await cookiesClient.models.Document.get({
    projectId,
    path,
  });

  if (errors) {
    console.error('error:', errors);
  }

  if (data) {
    return data;
  }

  return null;
}

export async function updateContent(
  projectId: string,
  path: string,
  content: string
) {
  const { data, errors } = await cookiesClient.models.Document.update({
    projectId,
    path,
    content,
  });

  if (errors) {
    console.error('error:', errors);
  }
}
