'use client';

import { useState } from 'react';
import { useProject } from './project-provider';
import { TreeView } from './tree-view';
import { EditButton } from './edit-button';

export function ProjectSidebar({
  activeTabId,
  activePath,
}: {
  activeTabId: string;
  activePath: string;
}) {
  const { project, updateProject } = useProject();
  const [isEditing, setIsEditing] = useState(false);

  const activeTab = project?.tabs.find((tab) => tab.id === activeTabId);

  const handleTreeChange = (newTree: any) => {
    if (project && activeTab) {
      const updatedTabs = project.tabs.map((tab) =>
        tab.id === activeTab.id ? { ...tab, sidebar: newTree } : tab
      );
      updateProject({ ...project, tabs: updatedTabs });
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Implement save logic here
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Implement cancel logic here
  };

  if (!project) return null;

  return (
    <div className="w-64 border-r overflow-y-auto bg-background">
      <div className="p-4">
        <div className="flex items-center mb-4">
          <EditButton
            isEditing={isEditing}
            onEdit={handleEdit}
            onSave={handleSave}
            onCancel={handleCancel}
            className="mr-2"
          />
          <h2 className="text-lg font-semibold">Documents</h2>
        </div>
        <TreeView
          tree={activeTab?.sidebar || []}
          onTreeChange={handleTreeChange}
          isEditing={isEditing}
          activePath={activePath}
          activeTabId={activeTabId}
        />
      </div>
    </div>
  );
}
