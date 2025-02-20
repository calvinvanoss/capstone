'use server';

import { Project, Doc } from '@/types/project';
import { cookiesClient } from './amplify-utils';

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
  const { data: contentData, errors: contentErrors } =
    await cookiesClient.models.Content.create({
      content: '',
    });

  if (contentData) {
    const { data, errors } = await cookiesClient.models.Project.create({
      name,
      description,
      content: contentData.id,
      children: '[]',
    });

    if (errors) {
      console.error('error:', errors);
    }
  }

  if (contentErrors) {
    console.error('error:', contentErrors);
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
  const { data: contentData, errors: contentErrors } =
    await cookiesClient.models.Content.create({
      content: '',
    });

  if (contentData) {
    const { data, errors } = await cookiesClient.models.Project.update({
      id: project.id,
      children: JSON.stringify([
        ...project.children,
        { name, id: slugify(name), content: contentData.id, children: [] },
      ]),
    });

    if (errors) {
      console.error('error:', errors);
    }
  }

  if (contentErrors) {
    console.error('error:', contentErrors);
  }
}

export async function createDocument(
  project: Project,
  name: string,
  parentPath: string,
  index: number,
  type: 'folder' | 'file'
) {
  const { data: contentData, errors: contentErrors } =
    await cookiesClient.models.Content.create({
      content: '',
    });

  if (contentData) {
    const parentPathArr = parentPath.split('/');

    const { data, errors } = await cookiesClient.models.Project.update({
      id: project.id,
      children: JSON.stringify(
        project.children.map((doc) => {
          if (doc.id === parentPathArr[1]) {
            let currentNode: Doc | undefined = doc;
            for (const path of parentPathArr.slice(2)) {
              currentNode = currentNode!.children!.find(
                (child) => child.id === path
              );
            }
            if (!currentNode) {
              throw new Error(`Path not found: ${parentPath}`);
            }
            const children = currentNode.children || [];
            children.splice(index, 0, {
              id: slugify(name),
              name,
              content: contentData.id,
              children: type === 'folder' ? [] : undefined,
            });
          }
          return doc;
        })
      ),
    });

    if (errors) {
      console.error('error:', errors);
    }
  }

  if (contentErrors) {
    console.error('error:', contentErrors);
  }
}

export async function getContent(project: Project, fullPath: string[]) {
  let currentNode: Doc | Project | undefined = project;
  if (fullPath.length > 1) {
    for (const path of fullPath.slice(1)) {
      currentNode = currentNode?.children!.find((child) => child.id === path);
    }
  }

  if (currentNode && currentNode.content) {
    const { data, errors } = await cookiesClient.models.Content.get({
      id: currentNode.content,
    });

    if (errors) {
      console.error('error:', errors);
    }

    if (data) {
      return data;
    }
  }
  return null;
}

export async function updateContent(id: string, content: string) {
  const { data, errors } = await cookiesClient.models.Content.update({
    id,
    content,
  });

  if (errors) {
    console.error('error:', errors);
  }
}
