'use client';

import Link from 'next/link';
import { TabsTrigger } from '@/components/ui/tabs';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { DocNode } from '@/lib/types';
import { useProject } from '@/lib/store';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';

export function TabItem({ doc }: { doc: DocNode }) {
  const { project } = useProject();
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isMoveOpen, setIsMoveOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [newName, setNewName] = useState('');

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

  // TODO: abstract context menu and dialogs into reusable wrapper component
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
          <TabsTrigger
            value={doc.slug}
            className="px-3 py-1.5 text-sm font-medium transition-all rounded-md data-[state=active]:bg-muted data-[state=active]:text-foreground flex flex-col items-center justify-between"
          >
            <Link href={`/${project.versionId}/${doc.slug}`} prefetch={false}>
              {doc.name}
            </Link>
          </TabsTrigger>
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
}
