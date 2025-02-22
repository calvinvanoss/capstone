'use client';

import { useState } from 'react';
import { TreeView } from './tree-view';
import { Button } from '@/components/ui/button';
import { Pencil, Check, X } from 'lucide-react';
import { useProjectStore } from '@/lib/zustand/store';

export function ProjectSidebar({ slugs }: { slugs: string[] }) {
  const { project } = useProjectStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTree, setEditedTree] = useState<any>(null);
  if (!project) return null;

  const activeTab = project.children.find((tab) => tab.slug === slugs[0]);

  const handleTreeChange = (newTree: any) => {
    if (isEditing) {
      setEditedTree(newTree);
    } else if (project && activeTab) {
      const updatedTabs = project.children.map((tab) =>
        tab.slug === activeTab.slug ? { ...tab, sidebar: newTree } : tab
      );
      console.log('update tabs api call');
    }
  };

  const startEditing = () => {
    setEditedTree(activeTab?.children || []);
    setIsEditing(true);
  };

  const confirmEditing = () => {
    if (editedTree && project && activeTab) {
      const updatedTabs = project.children.map((tab) =>
        tab.slug === activeTab.slug ? { ...tab, sidebar: editedTree } : tab
      );
      console.log('update tabs api call');
    }
    setIsEditing(false);
    setEditedTree(null);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditedTree(null);
  };

  return (
    <div className="w-64 border-r overflow-y-auto bg-background p-4">
      <div className="flex justify-between items-center mb-4">
        {isEditing ? (
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={confirmEditing}
              className="p-1 h-8 w-8"
            >
              <Check className="h-4 w-4 text-green-500" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={cancelEditing}
              className="p-1 h-8 w-8"
            >
              <X className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={startEditing}
            className="p-1 h-8 w-8"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </div>
      <TreeView
        slugs={slugs}
        tree={isEditing ? editedTree : activeTab?.children || []}
        isEditing={isEditing}
      />
    </div>
  );
}
