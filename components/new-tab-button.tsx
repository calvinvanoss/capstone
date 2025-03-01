'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { useProject } from '@/lib/store';

export function NewTabButton() {
  const { project, addDoc } = useProject();
  const [isOpen, setIsOpen] = useState(false);
  const [newTabName, setNewTabName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateTab = async () => {
    if (newTabName.trim()) {
      setIsLoading(true);
      try {
        addDoc(newTabName, '', project.children.length, 'folder');
        setIsOpen(false);
        setNewTabName('');
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to create tab:', error);
      }
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <Dialog open={isOpen || isLoading} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" className="ml-6 h-9 w-9">
                <Plus className="h-[1.2rem] w-[1.2rem]" />
                <span className="sr-only">Add Tab</span>
              </Button>
            </TooltipTrigger>
          </DialogTrigger>
          <TooltipContent>
            <p>Add new tab</p>
          </TooltipContent>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Tab</DialogTitle>
            </DialogHeader>
            <div className="flex items-center space-x-2">
              <Input
                value={newTabName}
                onChange={(e) => setNewTabName(e.target.value)}
                placeholder="Enter tab name"
              />
              <Button
                onClick={handleCreateTab}
                disabled={!newTabName.trim() || isLoading}
              >
                {isLoading ? 'Adding...' : 'Add'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </Tooltip>
    </TooltipProvider>
  );
}

export default NewTabButton;
