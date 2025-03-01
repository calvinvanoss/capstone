'use client';

import { DocNode, ProjectVersion } from '@/lib/types';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { createDoc, updateVersionTree } from './server-actions';

interface ProjectStore {
  project: ProjectVersion;
  setProject: (project: ProjectVersion) => void;
  addDoc: (
    name: string,
    path: string,
    index: number,
    type: 'folder' | 'file'
  ) => void;
}

export const useProject = create<ProjectStore>()(
  immer((set, get) => ({
    project: {} as ProjectVersion,
    setProject: (project) =>
      set((state) => {
        state.project = project;
      }),
    addDoc: async (name, path, index, type) => {
      const slug = slugify(name);

      set((state) => {
        const slugs = path ? path.split('/') : [];
        let currentNode: ProjectVersion | DocNode | undefined = state.project;
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
      await createDoc(
        project.projectId,
        project.versionId,
        path ? `${path}/${slug}` : slug
      );
      await updateVersionTree(project.versionId, project.children);
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
