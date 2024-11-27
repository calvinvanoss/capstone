'use client';

import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronDown, Grip } from 'lucide-react';
import Link from 'next/link';
import { useProject } from './project-provider';
import { useParams } from 'next/navigation';
import { cn } from '@/lib/utils';

export type TreeItem = {
  id: string;
  name: string;
  slug: string;
  type: 'folder' | 'document';
  children?: TreeItem[];
};

type TreeNodeProps = {
  item: TreeItem;
  onItemChange: (updatedItem: TreeItem) => void;
  onItemDelete: () => void;
  editable: boolean;
  path: string;
  activePath: string;
  activeTabId: string;
  mode: 'edit' | 'view';
  depth: number;
};

const TreeNode: React.FC<TreeNodeProps> = ({
  item,
  onItemChange,
  onItemDelete,
  editable,
  path,
  activePath,
  activeTabId,
  mode,
  depth,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { project } = useProject();
  const params = useParams();

  const [{ isDragging }, drag] = useDrag({
    type: 'TREE_ITEM',
    item: { id: item.id, type: 'TREE_ITEM' },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'TREE_ITEM',
    drop: (droppedItem: { id: string }, monitor) => {
      if (droppedItem.id !== item.id) {
        // Handle the drop (e.g., update the tree structure)
      }
    },
  });

  const toggleExpand = (e: React.MouseEvent) => {
    e.preventDefault();
    if (item.type === 'folder') {
      setIsExpanded(!isExpanded);
    }
  };

  const isActive = path === activePath;

  return (
    <div ref={drop}>
      <div
        className={cn(
          'flex items-center py-1 px-2 rounded-md transition-colors relative',
          isActive ? 'bg-accent text-accent-foreground' : 'hover:bg-muted',
          isDragging ? 'opacity-50' : ''
        )}
        ref={drag}
      >
        <div className="flex items-center flex-grow cursor-pointer pr-8">
          {editable && (
            <Grip className="mr-2 cursor-move h-4 w-4 text-muted-foreground flex-shrink-0" />
          )}
          <Link
            href={`/project/${params.id}/${mode}/${activeTabId}/${path}`}
            className={cn(
              'flex-grow truncate',
              isActive ? 'font-medium' : '',
              item.type === 'folder' ? 'font-medium' : '',
              !isActive && 'hover:text-primary'
            )}
            style={{ paddingLeft: `${depth * 12}px` }}
          >
            {item.name}
          </Link>
        </div>
        {item.type === 'folder' && (
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'p-0 h-6 w-6 absolute right-2 top-1/2 transform -translate-y-1/2 transition-colors',
              !isActive && 'hover:text-primary'
            )}
            onClick={toggleExpand}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>
      {isExpanded && item.children && (
        <div className="mt-1">
          {item.children.map((child) => (
            <TreeNode
              key={child.id}
              item={child}
              onItemChange={(updatedChild) => {
                const updatedChildren = item.children!.map((c) =>
                  c.id === updatedChild.id ? updatedChild : c
                );
                onItemChange({ ...item, children: updatedChildren });
              }}
              onItemDelete={() => {
                const updatedChildren = item.children!.filter(
                  (c) => c.id !== child.id
                );
                onItemChange({ ...item, children: updatedChildren });
              }}
              editable={editable}
              path={`${path}/${child.slug}`}
              activePath={activePath}
              activeTabId={activeTabId}
              mode={mode}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

type TreeViewProps = {
  tree: TreeItem[];
  onTreeChange: (newTree: TreeItem[]) => void;
  editable: boolean;
  activePath: string;
  activeTabId: string;
  mode: 'edit' | 'view';
};

export const TreeView: React.FC<TreeViewProps> = ({
  tree,
  onTreeChange,
  editable,
  activePath,
  activeTabId,
  mode,
}) => {
  return (
    <DndProvider backend={HTML5Backend}>
      {tree.map((item) => (
        <TreeNode
          key={item.id}
          item={item}
          onItemChange={(updatedItem) => {
            const updatedTree = tree.map((i) =>
              i.id === updatedItem.id ? updatedItem : i
            );
            onTreeChange(updatedTree);
          }}
          onItemDelete={() => {
            const updatedTree = tree.filter((i) => i.id !== item.id);
            onTreeChange(updatedTree);
          }}
          editable={editable}
          path={item.slug}
          activePath={activePath}
          activeTabId={activeTabId}
          mode={mode}
          depth={0}
        />
      ))}
    </DndProvider>
  );
};
