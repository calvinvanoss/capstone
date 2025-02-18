'use server';

import { cookiesClient } from './amplify-utils';

export async function createProject(prevState: any, formData: FormData) {
  console.log('formData:', formData);
  const { data: project, errors } = await cookiesClient.models.Project.create({
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    structure: '',
  });

  if (errors) {
    console.error('error:', errors);
  } else {
    console.log('project:', project);
  }
}
