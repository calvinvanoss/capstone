'use client';

import { createDocument } from '@/lib/server-actions';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { DialogHeader, DialogFooter } from './ui/dialog';
import { Input } from './ui/input';
import { Project } from '@/types/project';
import { Label } from './ui/label';
import { useRouter } from 'next/navigation';

export function NewDocButton({
  project,
  parentPath: parentPath,
  index,
}: {
  project: Project;
  parentPath: string;
  index: number;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [newDocName, setNewDocName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateDocument = async (type: 'folder' | 'file') => {
    if (newDocName.trim()) {
      setIsLoading(true);
      try {
        await createDocument(project, newDocName, parentPath, index, type);
        router.refresh();
        await new Promise((resolve) => setTimeout(resolve, 500)); // wait for new tab to show on frontend
        setIsOpen(false);
        setNewDocName('');
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to create document:', error);
      }
    }
  };

  return (
    <div className="absolute left-0 right-0 flex justify-center -mt-3 z-10">
      <Dialog open={isOpen || isLoading} onOpenChange={setIsOpen}>
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
                value={newDocName}
                onChange={(e) => setNewDocName(e.target.value)}
                className="col-span-3"
                disabled={isLoading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => handleCreateDocument('folder')}
              disabled={!newDocName.trim() || isLoading}
            >
              New Folder
            </Button>
            <Button
              onClick={() => handleCreateDocument('file')}
              disabled={!newDocName.trim() || isLoading}
            >
              New File
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default NewDocButton;
