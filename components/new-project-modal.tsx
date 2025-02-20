'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { createProject } from '@/lib/server-actions';
import { DialogTrigger } from '@radix-ui/react-dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function NewProjectModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateProject = async () => {
    if (name.trim()) {
      setIsLoading(true);
      try {
        await createProject(name, description);
        router.refresh();
        await new Promise((resolve) => setTimeout(resolve, 500)); // wait for new tab to show on frontend
        setIsOpen(false);
        setName('');
        setDescription('');
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to create project:', error);
      }
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <Dialog open={isOpen || isLoading} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <Plus className="h-4 w-4" />
                <span className="sr-only">Add Project</span>
              </Button>
            </TooltipTrigger>
          </DialogTrigger>
          <TooltipContent>
            <p>Add new project</p>
          </TooltipContent>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Project</DialogTitle>
              <DialogDescription>
                Create a new project by entering a name and description.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="name" className="text-right">
                  Name
                </label>
                <Input
                  className="col-span-3"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="description" className="text-right">
                  Description
                </label>
                <Textarea
                  className="col-span-3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleCreateProject}
                disabled={!name.trim() || isLoading}
              >
                {isLoading ? 'Adding...' : 'Add Project'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Tooltip>
    </TooltipProvider>
  );
}
