'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { AddProjectModal } from './add-project-modal';
import { signOut } from 'aws-amplify/auth';

export function DashboardHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center space-x-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsModalOpen(true)}
                className="h-8 w-8"
              >
                <Plus className="h-4 w-4" />
                <span className="sr-only">Add Project</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add new project</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="flex items-center space-x-4">
        <span>user.username</span>
        <Button onClick={() => signOut()}>Sign out</Button>
      </div>
      <AddProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
