'use client';

import React, { useEffect, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  ChevronRight,
  ChevronDown,
  GripVertical,
  Plus,
  Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Label } from './ui/label';
import { Project, Doc } from '@/types/project';
import { createDocument } from '@/lib/server-actions';

const TreeNode: React.FC<{
  project: Project;
  item: Doc;
  index: number;
  depth: number;
  isEditing: boolean;
  activePath: string;
  parentPath: string;
}> = ({ project, item, index, depth, isEditing, activePath, parentPath }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isNameEditing, setIsNameEditing] = useState(false);
  const [showAddButton, setShowAddButton] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const fullPath = `${parentPath}/${item.id}`;
  const isActive = activePath === fullPath;

  useEffect(() => {
    if (activePath.includes(fullPath) && 'children' in item) {
      setIsExpanded(true);
    }
  });

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
    if ('children' in item) {
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
                value={item.name}
                onChange={handleNameChange}
                onBlur={handleEditToggle}
                className="h-5 py-0 px-1 text-sm"
                autoFocus
              />
            ) : (
              <>
                {!isEditing ? (
                  <Link
                    href={`/dashboard/${fullPath}`}
                    className={cn(
                      'flex-grow flex items-center truncate',
                      isActive && !isEditing ? 'font-medium' : '',
                      'children' in item ? 'font-medium' : '',
                      !isActive && !isEditing && 'hover:text-primary'
                    )}
                  >
                    <span className="truncate">{item.name}</span>
                  </Link>
                ) : (
                  <span
                    className={cn(
                      'flex-grow flex items-center truncate cursor-pointer',
                      isActive ? 'font-medium' : '',
                      'children' in item ? 'font-medium' : '',
                      !isActive && 'hover:text-primary'
                    )}
                    onClick={handleEditToggle}
                  >
                    {item.name}
                  </span>
                )}
                {'children' in item && (
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
            <NewItemButton project={project} parentPath={fullPath} index={0} />
          ) : (
            <NewItemButton
              project={project}
              parentPath={parentPath}
              index={index + 1}
            />
          ))}
      </div>
      {isExpanded && item.children && (
        <div className="mt-1">
          {item.children.map((child, childIndex) => (
            <TreeNode
              key={child.id}
              project={project}
              item={child}
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
  tree,
  isEditing,
}: {
  project: Project;
  tree: Doc[];
  isEditing: boolean;
}) => {
  const params = useParams();
  const [isHoveringTop, setIsHoveringTop] = useState(false);

  return (
    <div className="relative">
      <div
        className="absolute left-0 right-0 h-3 -top-3"
        onMouseEnter={() => setIsHoveringTop(true)}
        onMouseLeave={() => setIsHoveringTop(false)}
      >
        {(isHoveringTop || tree.length === 0) && (
          <NewItemButton
            project={project}
            parentPath={
              Array.isArray(params.slugs)
                ? params.slugs.slice(0, 2).join('/')
                : ''
            }
            index={0}
          />
        )}
      </div>
      {tree.map((item, index) => (
        <TreeNode
          key={item.id}
          project={project}
          item={item}
          index={index}
          depth={0}
          isEditing={isEditing}
          activePath={Array.isArray(params.slugs) ? params.slugs.join('/') : ''}
          parentPath={
            Array.isArray(params.slugs)
              ? params.slugs.slice(0, 2).join('/')
              : ''
          }
        />
      ))}
    </div>
  );
};

const NewItemButton: React.FC<{
  project: Project;
  parentPath: string;
  index: number;
}> = ({ project, parentPath, index }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newItemName, setNewItemName] = useState('');

  return (
    <div className="absolute left-0 right-0 flex justify-center -mt-3 z-10">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-6 w-6 p-0 rounded-full bg-background border-dashed"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Item</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() =>
                createDocument(
                  project,
                  newItemName,
                  parentPath,
                  index,
                  'folder'
                )
              }
              disabled={!newItemName.trim()}
            >
              New Folder
            </Button>
            <Button
              onClick={() =>
                createDocument(project, newItemName, parentPath, index, 'file')
              }
              disabled={!newItemName.trim()}
            >
              New File
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
