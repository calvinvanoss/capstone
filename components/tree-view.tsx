'use client';

import React, { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type TreeItem = {
  id: string;
  name: string;
  children?: TreeItem[];
};

type TreeNodeProps = {
  item: TreeItem;
  onItemChange: (updatedItem: TreeItem) => void;
  onItemDelete: () => void;
  onItemCreate: (
    parentId: string,
    type: 'folder' | 'document',
    index: number
  ) => void;
  depth: number;
  index: number;
  isEditing: boolean;
  activePath: string;
  activeTabId: string;
  parentPath: string;
};

const TreeNode: React.FC<TreeNodeProps> = ({
  item,
  onItemChange,
  onItemDelete,
  onItemCreate,
  depth,
  index,
  isEditing,
  activePath,
  activeTabId,
  parentPath,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isNameEditing, setIsNameEditing] = useState(false);
  const [showAddButton, setShowAddButton] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
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
    if ('children' in item) {
      setIsExpanded(!isExpanded);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onItemChange({ ...item, name: e.target.value });
  };

  const handleEditToggle = () => {
    setIsNameEditing(!isNameEditing);
  };

  const handleAddItem = (type: 'folder' | 'document') => {
    onItemCreate(item.id, type, index + 1);
    setIsDialogOpen(false);
  };

  const fullPath = `${parentPath}/${item.id}`;
  const isActive = activePath === fullPath;

  return (
    <>
      <div
        ref={isEditing ? drop : undefined}
        onMouseEnter={() => {
          isEditing && setShowAddButton(true);
          setIsHovering(true);
        }}
        onMouseLeave={() => {
          isEditing && setShowAddButton(false);
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
                    href={`/dashboard/${params.slugs[0]}/${activeTabId}/${fullPath}`}
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
              onClick={onItemDelete}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        )}
        {isEditing && showAddButton && (
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
                <div className="flex justify-around mt-4">
                  <Button onClick={() => handleAddItem('folder')}>
                    New Folder
                  </Button>
                  <Button onClick={() => handleAddItem('document')}>
                    New File
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
      {isExpanded && item.children && (
        <div className="mt-1">
          {item.children.map((child, childIndex) => (
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
              onItemCreate={onItemCreate}
              depth={depth + 1}
              index={childIndex}
              isEditing={isEditing}
              activePath={activePath}
              activeTabId={activeTabId}
              parentPath={fullPath}
            />
          ))}
        </div>
      )}
    </>
  );
};

type TreeViewProps = {
  tree: TreeItem[];
  onTreeChange: (newTree: TreeItem[]) => void;
  isEditing: boolean;
  activePath: string;
  activeTabId: string;
};

export const TreeView: React.FC<TreeViewProps> = ({
  tree,
  onTreeChange,
  isEditing,
  activePath,
  activeTabId,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleItemCreate = (
    parentId: string,
    type: 'folder' | 'document',
    index: number
  ) => {
    console.log('Create new item api call', parentId, type, index);
    /*

    const addItemToTree = (items: TreeItem[]): TreeItem[] => {
      if (parentId === '') {
        return [...items.slice(0, index), newItem, ...items.slice(index)];
      }
      return items.map((item) => {
        if (item.id === parentId) {
          return {
            ...item,
            children: [
              ...(item.children || []).slice(0, index),
              newItem,
              ...(item.children || []).slice(index),
            ],
          };
        } else if (item.children) {
          return {
            ...item,
            children: addItemToTree(item.children),
          };
        }
        return item;
      });
    };

    const newTree = addItemToTree(tree);
    onTreeChange(newTree);
    */
  };

  const [isHoveringTop, setIsHoveringTop] = useState(false);

  const handleAddTopLevelItem = (type: 'folder' | 'document') => {
    console.log('Create new top level item api call', type);
    /*
    onTreeChange([newItem, ...tree]);
    setIsDialogOpen(false);
    */
  };

  return (
    <div className="relative">
      {isEditing && tree.length > 0 && (
        <div
          className="absolute left-0 right-0 h-3 -top-3"
          onMouseEnter={() => setIsHoveringTop(true)}
          onMouseLeave={() => setIsHoveringTop(false)}
        >
          {isHoveringTop && (
            <div className="absolute left-0 right-0 flex justify-center -mt-3 z-10">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
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
                        <div className="flex justify-around mt-4">
                          <Button
                            onClick={() => handleAddTopLevelItem('folder')}
                          >
                            New Folder
                          </Button>
                          <Button
                            onClick={() => handleAddTopLevelItem('document')}
                          >
                            New File
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add new item</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>
      )}
      {tree.map((item, index) => (
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
          onItemCreate={handleItemCreate}
          depth={0}
          index={index}
          isEditing={isEditing}
          activePath={activePath}
          activeTabId={activeTabId}
          parentPath=""
        />
      ))}
      <div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-6 w-6 p-0 rounded-full bg-background border-dashed mt-4"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Item</DialogTitle>
                  </DialogHeader>
                  <div className="flex justify-around mt-4">
                    <Button
                      onClick={() => {
                        handleAddTopLevelItem('folder');
                        setIsDialogOpen(false);
                      }}
                    >
                      New Folder
                    </Button>
                    <Button
                      onClick={() => {
                        handleAddTopLevelItem('document');
                        setIsDialogOpen(false);
                      }}
                    >
                      New File
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </TooltipTrigger>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};
