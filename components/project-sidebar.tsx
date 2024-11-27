'use client';

import { useProject } from './project-provider';
import { TreeItem, TreeView } from './tree-view';

export function ProjectSidebar({
  mode,
  activeTabId,
  activePath,
}: {
  mode: 'edit' | 'view';
  activeTabId: string;
  activePath: string;
}) {
  const { project, updateProject } = useProject();

  const activeTab = project?.tabs.find((tab) => tab.id === activeTabId);

  const handleTreeChange = (newTree: TreeItem[]) => {
    if (project && activeTab) {
      const updatedTabs = project.tabs.map((tab) =>
        tab.id === activeTab.id ? { ...tab, sidebar: newTree } : tab
      );
      updateProject({ ...project, tabs: updatedTabs });
    }
  };

  if (!project) return null;

  return (
    <div className="w-64 border-r overflow-y-auto">
      <div className="p-4">
        <TreeView
          tree={activeTab?.sidebar || []}
          onTreeChange={handleTreeChange}
          editable={mode === 'edit'}
          activePath={activePath}
          activeTabId={activeTabId}
          mode={mode}
        />
      </div>
    </div>
  );
}
