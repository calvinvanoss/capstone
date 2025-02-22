'use server';

import { DocNode, Project } from '@/types/project';
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

// readable name to slug path
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-.~!*'()]+/g, '') // Remove all non url friendly chars
    .replace(/\-\-+/g, '-'); // Replace multiple - with single -
}

export async function createDocument(
  project: Project,
  name: string,
  path: string,
  index: number,
  type: 'folder' | 'file'
) {
  const slugs = path ? path.split('/') : [];
  let currentNode: Project | DocNode | undefined = project;
  for (const slug of slugs) {
    currentNode = currentNode.children?.find((child) => child.slug === slug);
    if (!currentNode) {
      throw new Error('Invalid path');
    }
  }

  const slug = slugify(name);
  const { data: documentData, errors: documentErrors } =
    await cookiesClient.models.Document.create({
      path: path ? `${project.id}/${path}/${slug}` : `${project.id}/${slug}`,
      content: '',
    });

  if (documentData) {
    if (currentNode.children) {
      currentNode.children.splice(index, 0, {
        name,
        slug,
        children: type === 'folder' ? [] : undefined,
      });
    } else {
      currentNode.children = [
        {
          name,
          slug,
          children: type === 'folder' ? [] : undefined,
        },
      ];
    }

    const { data, errors } = await cookiesClient.models.Project.update({
      id: project.id,
      children: JSON.stringify(project.children),
    });

    if (errors) {
      console.error('error:', errors);
    }
  }

  if (documentErrors) {
    console.error('error:', documentErrors);
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
