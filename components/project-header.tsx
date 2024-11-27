'use client';

import { useProject } from './project-provider';
import { Button } from '@/components/ui/button';
import { useRouter, useParams } from 'next/navigation';
import { ProjectTabs } from './project-tabs';
import { Pencil, Eye, Home } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ThemeToggle } from './theme-toggle';
import Link from 'next/link';

export function ProjectHeader({
  mode,
  activeTabId,
}: {
  mode: 'edit' | 'view';
  activeTabId: string;
}) {
  const { project } = useProject();
  const router = useRouter();
  const params = useParams();

  const toggleMode = () => {
    const newMode = mode === 'edit' ? 'view' : 'edit';
    const currentPath = window.location.pathname;
    if (
      currentPath.endsWith(params.id as string) ||
      currentPath.endsWith(`/${mode}`)
    ) {
      router.push(`/project/${params.id}/${newMode}`);
    } else {
      const newPath = currentPath.replace(`/${mode}/`, `/${newMode}/`);
      router.push(newPath);
    }
  };

  if (!project) return null;

  return (
    <header className="flex justify-between items-center p-4 border-b">
      <div className="flex items-center space-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/dashboard"
                className="p-2 rounded-md transition-colors duration-200 ease-in-out hover:bg-primary/10"
              >
                <Home className="h-5 w-5 text-primary" />
                <span className="sr-only">Return to Dashboard</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>Return to Dashboard</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Link
          href={`/project/${params.id}/${mode}`}
          className="group px-3 py-2 rounded-md transition-colors duration-200 ease-in-out hover:bg-primary/10"
        >
          <h1 className="text-2xl font-bold group-hover:text-primary group-hover:underline">
            {project.name}
          </h1>
        </Link>
      </div>
      <div className="flex-grow mx-4 max-w-2xl">
        <ProjectTabs mode={mode} activeTabId={activeTabId} />
      </div>
      <div className="flex items-center space-x-2">
        <ThemeToggle />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={toggleMode} size="icon">
                {mode === 'edit' ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <Pencil className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{mode === 'edit' ? 'Switch to View' : 'Switch to Edit'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </header>
  );
}
