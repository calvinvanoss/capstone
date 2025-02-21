'use client';

import React, { useEffect, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronRight, ChevronDown, GripVertical, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Project, DocNode } from '@/types/project';
import { NewDocButton } from './new-doc-button';

const TreeNode: React.FC<{
  project: Project;
  node: DocNode;
  index: number;
  depth: number;
  isEditing: boolean;
  activePath: string;
  parentPath: string;
}> = ({ project, node, index, depth, isEditing, activePath, parentPath }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isNameEditing, setIsNameEditing] = useState(false);
  const [showAddButton, setShowAddButton] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const fullPath = `${parentPath}/${node.slug}`;
  const isActive = activePath === fullPath;

  useEffect(() => {
    if (activePath.includes(fullPath) && 'children' in node) {
      setIsExpanded(true);
    }
  }, [activePath, fullPath, node]);

  const [{ isDragging }, drag] = useDrag({
    type: 'TREE_ITEM',
    item: { id: node.slug, type: 'TREE_ITEM' },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'TREE_ITEM',
    drop: (droppedItem: { id: string }, monitor) => {
      if (droppedItem.id !== node.slug) {
        // Handle the drop (e.g., update the tree structure)
      }
    },
  });

  const toggleExpand = (e: React.MouseEvent) => {
    e.preventDefault();
    if ('children' in node) {
      setIsExpanded(!isExpanded);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('name change api call', e.target.value);
  };

  const handleEditToggle = () => {
    setIsNameEditing(!isNameEditing);
  };

  return (
    <>
      <div
        ref={isEditing ? drop : undefined}
        onMouseEnter={() => {
          setShowAddButton(true);
          setIsHovering(true);
        }}
        onMouseLeave={() => {
          setShowAddButton(false);
          setIsHovering(false);
        }}
        className="relative group"
      >
        <div
          className={cn(
            'flex items-center py-1 px-2 rounded-md transition-colors relative',
            isActive && !isEditing
              ? 'bg-accent text-accent-foreground'
              : 'hover:bg-muted',
            isDragging ? 'opacity-50' : ''
          )}
          ref={isEditing ? drag : undefined}
        >
          <div
            className="flex items-center flex-grow py-0.5 text-sm"
            style={{ paddingLeft: `${depth * 8 + 4}px` }}
          >
            {isEditing && (
              <div
                className={cn(
                  'absolute left-[-20px] w-6 h-full flex items-center justify-center transition-opacity duration-200',
                  isHovering ? 'opacity-100' : 'opacity-0'
                )}
              >
                <GripVertical className="h-3.5 w-3.5 text-muted-foreground cursor-move" />
              </div>
            )}
            {isEditing && isNameEditing ? (
              <Input
                value={node.name}
                onChange={handleNameChange}
                onBlur={handleEditToggle}
                className="h-5 py-0 px-1 text-sm"
                autoFocus
              />
            ) : (
              <>
                {!isEditing ? (
                  <Link
                    href={`/${fullPath}`}
                    className={cn(
                      'flex-grow flex items-center truncate',
                      isActive && !isEditing ? 'font-medium' : '',
                      'children' in node ? 'font-medium' : '',
                      !isActive && !isEditing && 'hover:text-primary'
                    )}
                  >
                    <span className="truncate">{node.name}</span>
                  </Link>
                ) : (
                  <span
                    className={cn(
                      'flex-grow flex items-center truncate cursor-pointer',
                      isActive ? 'font-medium' : '',
                      'children' in node ? 'font-medium' : '',
                      !isActive && 'hover:text-primary'
                    )}
                    onClick={handleEditToggle}
                  >
                    {node.name}
                  </span>
                )}
                {'children' in node && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="p-0 h-5 w-5 ml-1"
                    onClick={toggleExpand}
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5" />
                    )}
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
        {isEditing && (
          <div
            className={cn(
              'absolute right-[-20px] top-0 h-full flex items-center justify-center transition-opacity duration-200',
              isHovering ? 'opacity-100' : 'opacity-0'
            )}
          >
            <Button
              variant="ghost"
              size="sm"
              className="h-5 w-5 p-0 text-destructive"
              onClick={() => console.log('delete item api call')}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        )}
        {showAddButton &&
          (isExpanded ? (
            <NewDocButton project={project} parentPath={fullPath} index={0} />
          ) : (
            <NewDocButton
              project={project}
              parentPath={parentPath}
              index={index + 1}
            />
          ))}
      </div>
      {isExpanded && node.children && (
        <div className="mt-1">
          {node.children.map((child, childIndex) => (
            <TreeNode
              key={child.slug}
              project={project}
              node={child}
              index={childIndex}
              depth={depth + 1}
              isEditing={isEditing}
              activePath={activePath}
              parentPath={fullPath}
            />
          ))}
        </div>
      )}
    </>
  );
};

export const TreeView = ({
  project,
  slugs,
  tree,
  isEditing,
}: {
  project: Project;
  slugs: string[];
  tree: DocNode[];
  isEditing: boolean;
}) => {
  const [isHoveringTop, setIsHoveringTop] = useState(false);

  return (
    <div className="relative">
      <div
        className="absolute left-0 right-0 h-3 -top-3"
        onMouseEnter={() => setIsHoveringTop(true)}
        onMouseLeave={() => setIsHoveringTop(false)}
      >
        {(isHoveringTop || tree.length === 0) && (
          <NewDocButton
            project={project}
            parentPath={slugs.slice(0, 2).join('/')}
            index={0}
          />
        )}
      </div>
      {tree.map((item, index) => (
        <TreeNode
          key={item.slug}
          project={project}
          node={item}
          index={index}
          depth={0}
          isEditing={isEditing}
          activePath={slugs.join('/')}
          parentPath={slugs.slice(0, 2).join('/')}
        />
      ))}
    </div>
  );
};
