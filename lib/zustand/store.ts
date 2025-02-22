'use client';

import { DocNode, Project } from '@/types/project';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { postDocument, putProject } from '../server-actions';

interface ProjectStore {
  project: Project;
  setProject: (project: Project) => void;
  createDocument: (
    name: string,
    path: string,
    index: number,
    type: 'folder' | 'file'
  ) => void;
}

export const useProject = create<ProjectStore>()(
  immer((set, get) => ({
    project: {} as Project,
    setProject: (project) =>
      set((state) => {
        state.project = project;
      }),
    createDocument: async (name, path, index, type) => {
      const slug = slugify(name);

      set((state) => {
        const slugs = path ? path.split('/') : [];
        let currentNode: Project | DocNode | undefined = state.project;
        for (const slug of slugs) {
          currentNode = currentNode.children?.find(
            (child) => child.slug === slug
          );
          if (!currentNode) {
            throw new Error('Invalid path');
          }
        }
        const newDoc: DocNode = {
          name,
          slug,
          ...(type === 'folder' && { children: [] }),
        };
        if (currentNode.children) {
          currentNode.children.splice(index, 0, newDoc);
        } else {
          currentNode.children = [newDoc];
        }
      });

      const { project } = get();
      await postDocument(
        path ? `${project.id}/${path}/${slug}` : `${project.id}/${slug}`
      );
      await putProject(project);
    },
  }))
);

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
