'use client';

import { TreeView } from './tree-view';
import { useProject } from '@/lib/zustand/store';

export function ProjectSidebar({ slugs }: { slugs: string[] }) {
  const { project } = useProject();

  const activeTab = project.children.find((tab) => tab.slug === slugs[0]);

  return (
    <div className="w-64 border-r overflow-y-auto bg-background p-4">
      <div className="flex justify-between items-center mb-4"></div>
      <TreeView slugs={slugs} tree={activeTab?.children || []} />
    </div>
  );
}
