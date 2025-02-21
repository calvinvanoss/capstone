'use server';

import { Project } from '@/types/project';
import { cookiesClient } from './amplify-utils';

/* NAMING CONVENTION:
fullPath: string => full url path including project id
path: string => path url excluding project id
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
      structure: '[]',
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
  } else {
    console.log('deleteProject:', data);
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

export async function createTab(project: Project, name: string) {
  const slug = slugify(name);
  const { data: documentData, errors: documentErrors } =
    await cookiesClient.models.Document.create({
      path: `${project.id}/${slug}`,
      content: '',
    });

  if (documentData) {
    const { data, errors } = await cookiesClient.models.Project.update({
      id: project.id,
      structure: JSON.stringify([
        ...project.structure,
        { name, slug, children: [] },
      ]),
    });

    if (errors) {
      console.error('error:', errors);
    }
  }

  if (documentErrors) {
    console.error('error:', documentErrors);
  }
}

export async function createDocument(
  project: Project,
  name: string,
  fullPath: string,
  index: number,
  type: 'folder' | 'file'
) {
  const slug = slugify(name);
  const { data: documentData, errors: documentErrors } =
    await cookiesClient.models.Document.create({
      path: `${fullPath}/${slug}`,
      content: '',
    });

  if (documentData) {
    const fullPathArr = fullPath.split('/');

    for (const doc of project.structure) {
      let currentNode = doc;
      if (doc.slug === fullPathArr[1]) {
        for (const path of fullPathArr.slice(2)) {
          currentNode = currentNode.children!.find(
            (child) => child.slug === path
          )!;
        }
        if (currentNode.children) {
          currentNode.children.splice(index, 0, {
            name,
            slug,
            children: type === 'folder' ? [] : undefined,
          });
        }
      }
    }

    const { data, errors } = await cookiesClient.models.Project.update({
      id: project.id,
      structure: JSON.stringify(project.structure),
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

export async function updateContent(fullPath: string, content: string) {
  const { data, errors } = await cookiesClient.models.Document.update({
    path: fullPath,
    content,
  });

  if (errors) {
    console.error('error:', errors);
  }
}
