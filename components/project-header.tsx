'use client';

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
import { useProject } from '@/lib/zustand/store';

export function ProjectHeader() {
  const { project } = useProject();

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
        <Link
          href={`/${project.id}`}
          className="group px-3 py-2 rounded-md transition-colors duration-200 ease-in-out hover:bg-muted"
        >
          <h1 className="text-2xl font-bold group-hover:text-primary">
            {project.name}
          </h1>
        </Link>
      </div>
      <div className="flex-grow mx-4 max-w-2xl">
        <ProjectTabs />
      </div>
      <div className="flex items-center space-x-4">
        <ThemeToggle />
      </div>
    </header>
  );
}
