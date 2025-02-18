'use server';

import { Project } from '@/types/project';
import { cookiesClient } from './amplify-utils';

export async function createProject(name: string, description: string) {
  const { data: project, errors } = await cookiesClient.models.Project.create({
    name,
    description,
    tabs: '[]',
  });

  if (errors) {
    console.error('error:', errors);
  }
}

// readable name to slug path
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-'); // Replace multiple - with single -
}

export async function createTab(name: string, project: Project) {
  const { data: newProject, errors } =
    await cookiesClient.models.Project.update({
      id: project.id,
      tabs: JSON.stringify([
        ...project.tabs,
        { name, id: slugify(name), content: 'createTabContent' },
      ]),
    });

  if (errors) {
    console.error('error:', errors);
  }
}
