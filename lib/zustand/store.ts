'use client';

import { Project } from '@/types/project';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface ProjectStore {
  project: Project | null;
  setProject: (project: Project) => void;
}

export const useProjectStore = create<ProjectStore>()(
  immer((set) => ({
    project: null,
    setProject: (project) =>
      set((state) => {
        state.project = project;
      }),
  }))
);
