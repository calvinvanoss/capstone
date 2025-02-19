'use server';

import { Project, Doc } from '@/types/project';
import { cookiesClient } from './amplify-utils';

export async function getProject(projectId: string) {
  const { data, errors } = await cookiesClient.models.Project.get({
    id: projectId,
  });

  if (errors) {
    console.error('error:', errors);
  } else {
    console.log('getProject:', data);
  }

  return data;
}

export async function createProject(name: string, description: string) {
  const { data, errors } = await cookiesClient.models.Project.create({
    name,
    description,
    tabs: '[]',
  });

  if (errors) {
    console.error('error:', errors);
  } else {
    console.log('createProject:', data);
  }
}

export async function deleteProject(projectId: string) {
  const { data, errors } = await cookiesClient.models.Project.delete({
    id: projectId,
  })

  if (errors) {
    console.error("error:", errors)
    throw new Error("Failed to delete project")
  } else {
    console.log("deleteProject:", data)
  }

  return data
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
  const { data, errors } = await cookiesClient.models.Project.update({
    id: project.id,
    tabs: JSON.stringify([
      ...project.tabs,
      { name, id: slugify(name), content: 'createTabContent', children: [] },
    ]),
  });

  if (errors) {
    console.error('error:', errors);
  } else {
    console.log('createTab:', data);
  }
}

export async function createDocument(
  project: Project,
  name: string,
  parentPath: string,
  index: number,
  type: 'folder' | 'file'
) {
  const parentPathArr = parentPath.split('/');

  const { data, errors } = await cookiesClient.models.Project.update({
    id: project.id,
    tabs: JSON.stringify(
      project.tabs.map((tab) => {
        if (tab.id === parentPathArr[1]) {
          let currentNode: Doc | undefined = tab;
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
            content: 'createDocContent',
            children: type === 'folder' ? [] : undefined,
          });
        }
        return tab;
      })
    ),
  });

  if (errors) {
    console.error('error:', errors);
  } else {
    console.log('createDocument:', data);
  }
}
