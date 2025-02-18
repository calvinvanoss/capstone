'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { ProjectTabs } from './project-tabs';
import { Home } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ThemeToggle } from './theme-toggle';
import Link from 'next/link';
import { EditButton } from './edit-button';
import { Input } from '@/components/ui/input';

export function ProjectHeader({
  project,
  activeTabId,
}: {
  project: any;
  activeTabId: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(project?.name || '');
  const [isTitleEditing, setIsTitleEditing] = useState(false);

  if (!project) return null;

  const handleEdit = () => {
    setIsEditing(true);
    setEditedName(project.name);
  };

  const handleSave = () => {
    console.log('update name api call');
    setIsEditing(false);
    setIsTitleEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsTitleEditing(false);
    setEditedName(project.name);
  };

  return (
    <header className="flex justify-between items-center p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center space-x-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/dashboard"
                className="p-2 rounded-full transition-colors duration-200 ease-in-out hover:bg-muted"
              >
                <Home className="h-5 w-5 text-muted-foreground" />
                <span className="sr-only">Return to Dashboard</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>Return to Dashboard</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <EditButton
          isEditing={isEditing}
          onEdit={handleEdit}
          onSave={handleSave}
          onCancel={handleCancel}
          className="mr-2"
        />
        {isEditing ? (
          isTitleEditing ? (
            <Input
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onBlur={() => setIsTitleEditing(false)}
              className="h-9 text-2xl font-bold px-3 py-1"
              autoFocus
            />
          ) : (
            <h1
              className="text-2xl font-bold px-3 py-2 cursor-pointer hover:bg-muted rounded-md"
              onClick={() => setIsTitleEditing(true)}
            >
              {editedName}
            </h1>
          )
        ) : (
          <Link
            href={`/dashboard/${project.id}`}
            className="group px-3 py-2 rounded-md transition-colors duration-200 ease-in-out hover:bg-muted"
          >
            <h1 className="text-2xl font-bold group-hover:text-primary">
              {project.name}
            </h1>
          </Link>
        )}
      </div>
      <div className="flex-grow mx-4 max-w-2xl">
        <ProjectTabs
          project={project}
          activeTabId={activeTabId}
          isEditing={isEditing}
        />
      </div>
      <div className="flex items-center space-x-4">
        <ThemeToggle />
      </div>
    </header>
  );
}
