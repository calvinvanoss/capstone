'use server';

import { Project } from '@/types/project';
import { cookiesClient } from './amplify-utils';

/* NAMING CONVENTION:
fullPath: string => full url path including project id
path: string => path url excluding project id
projectId: string => project id
slugs: string[] => array of slugs (excludes project id)
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
      path: projectData.id,
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

export async function postDocument(path: string) {
  const { data, errors } = await cookiesClient.models.Document.create({
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

export async function getContent(fullPath: string) {
  const { data, errors } = await cookiesClient.models.Document.get({
    path: fullPath,
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
    path: `${projectId}/${path}`,
    content,
  });

  if (errors) {
    console.error('error:', errors);
  }
}
