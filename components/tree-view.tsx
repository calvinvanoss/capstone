'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { DocNode } from '@/lib/types';
import { NewDocButton } from './new-doc-button';
import { useProject } from '@/lib/store';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from './ui/context-menu';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';

const TreeNode: React.FC<{
  node: DocNode;
  index: number;
  depth: number;
  activePath: string;
  parentPath: string;
}> = ({ node, index, depth, activePath, parentPath }) => {
  const { project } = useProject();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isMoveOpen, setIsMoveOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [newName, setNewName] = useState('');

  const path = `${parentPath}/${node.slug}`;
  const isActive = activePath === path;

  useEffect(() => {
    // TODO: make children type safe
    if (activePath.includes(path) && 'children' in node) {
      setIsExpanded(true);
    }
  }, [activePath, path, node]);

  const toggleExpand = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsExpanded(!isExpanded);
  };

  const handleRename = () => {
    console.log('rename');
    setIsRenameOpen(false);
  };

  const handleMove = () => {
    console.log('move');
    setIsMoveOpen(false);
  };

  const handleDelete = () => {
    console.log('delete');
    setIsDeleteOpen(false);
  };

  if (!project.editable) {
    return (
      <>
        <div
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          className="relative group"
        >
          <div
            className={cn(
              'flex items-center py-1 px-2 rounded-md transition-colors relative',
              isActive ? 'bg-accent text-accent-foreground' : 'hover:bg-muted'
            )}
          >
            <div
              className="flex items-center flex-grow py-0.5 text-sm"
              style={{ paddingLeft: `${depth * 8 + 4}px` }}
            >
              <Link
                href={`/${project.versionId}/${path}`}
                prefetch={false}
                className={cn(
                  'flex-grow flex items-center truncate',
                  isActive ? 'font-medium' : '',
                  'children' in node ? 'font-medium' : '',
                  !isActive && 'hover:text-primary'
                )}
              >
                <span className="truncate">{node.name}</span>
              </Link>
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
            </div>
          </div>
          {project.editable &&
            isHovering &&
            (isExpanded ? (
              <NewDocButton parentPath={path} index={0} />
            ) : (
              <NewDocButton parentPath={parentPath} index={index + 1} />
            ))}
        </div>
        {isExpanded && node.children && (
          <div className="mt-1">
            {node.children.map((child, childIndex) => (
              <TreeNode
                key={child.slug}
                node={child}
                index={childIndex}
                depth={depth + 1}
                activePath={activePath}
                parentPath={path}
              />
            ))}
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <ContextMenu
        key={
          isRenameOpen
            ? 'rename'
            : isMoveOpen
              ? 'move'
              : isDeleteOpen
                ? 'delete'
                : 'default'
        }
      >
        <ContextMenuTrigger>
          <div
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className="relative group"
          >
            <div
              className={cn(
                'flex items-center py-1 px-2 rounded-md transition-colors relative',
                isActive ? 'bg-accent text-accent-foreground' : 'hover:bg-muted'
              )}
            >
              <div
                className="flex items-center flex-grow py-0.5 text-sm"
                style={{ paddingLeft: `${depth * 8 + 4}px` }}
              >
                <Link
                  href={`/${project.versionId}/${path}`}
                  prefetch={false}
                  className={cn(
                    'flex-grow flex items-center truncate',
                    isActive ? 'font-medium' : '',
                    'children' in node ? 'font-medium' : '',
                    !isActive && 'hover:text-primary'
                  )}
                >
                  <span className="truncate">{node.name}</span>
                </Link>
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
              </div>
            </div>
            {project.editable &&
              isHovering &&
              (isExpanded ? (
                <NewDocButton parentPath={path} index={0} />
              ) : (
                <NewDocButton parentPath={parentPath} index={index + 1} />
              ))}
          </div>
          {isExpanded && node.children && (
            <div className="mt-1">
              {node.children.map((child, childIndex) => (
                <TreeNode
                  key={child.slug}
                  node={child}
                  index={childIndex}
                  depth={depth + 1}
                  activePath={activePath}
                  parentPath={path}
                />
              ))}
            </div>
          )}
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onSelect={() => setIsRenameOpen(true)}>
            Rename
          </ContextMenuItem>
          <ContextMenuItem onSelect={() => setIsMoveOpen(true)}>
            Move
          </ContextMenuItem>
          <ContextMenuItem
            onSelect={() => setIsDeleteOpen(true)}
            className="text-red-600"
          >
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {/* Rename Dialog */}
      <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Document</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rename" className="text-right">
                New Name
              </Label>
              <Input
                id="rename"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleRename} disabled={!newName.trim()}>
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Move Dialog */}
      <Dialog open={isMoveOpen} onOpenChange={setIsMoveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Move Document</DialogTitle>
          </DialogHeader>
          {/* Add move logic here */}
          <DialogFooter>
            <Button onClick={handleMove}>Move</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Document</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this document?</p>
          <DialogFooter>
            <Button onClick={handleDelete} className="text-red-600">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export const TreeView = ({
  slugs,
  tree,
}: {
  slugs: string[];
  tree: DocNode[];
}) => {
  const { project } = useProject();
  const [isHoveringTop, setIsHoveringTop] = useState(false);

  return (
    <div className="relative">
      <div
        className="absolute left-0 right-0 h-3 -top-3"
        onMouseEnter={() => setIsHoveringTop(true)}
        onMouseLeave={() => setIsHoveringTop(false)}
      >
        {project.editable && (isHoveringTop || tree.length === 0) && (
          <NewDocButton parentPath={slugs[0]} index={0} />
        )}
      </div>
      {tree.map((item, index) => (
        <TreeNode
          key={item.slug}
          node={item}
          index={index}
          depth={0}
          activePath={slugs.join('/')}
          parentPath={slugs[0]}
        />
      ))}
    </div>
  );
};
