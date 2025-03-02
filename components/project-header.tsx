'use client';

import { ProjectTabs } from './project-tabs';
import {
  Home,
  Loader2,
  MoveDownRight,
  MoveUpLeft,
  RefreshCcw,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ThemeToggle } from './theme-toggle';
import Link from 'next/link';
import { useProject } from '@/lib/store';
import { Button } from './ui/button';
import { useState } from 'react';
import { pullLatestVersion, pushVersion } from '@/lib/server-actions';

export function ProjectHeader() {
  const { project } = useProject();
  const [isSyncing, setIsSyncing] = useState(false);
  const [isPushing, setIsPushing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);

  const handleResync = async () => {
    setIsSyncing(true);
    await pullLatestVersion(project.projectId, project.versionId);
  };

  const handlePush = async () => {
    setIsPushing(true);
    await pushVersion(
      project.projectId,
      project.versionId,
      project.currentVersionCount
    );
  };

  const handlePull = async () => {
    // TODO: implement rebase
    console.log('Pulling project...');
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
        <Link
          href={`/${project.versionId}`}
          className="group px-3 py-2 rounded-md transition-colors duration-200 ease-in-out hover:bg-muted"
        >
          <h1 className="text-2xl font-bold group-hover:text-primary">
            {project.projectName}
          </h1>
        </Link>
        <div className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResync}
                  disabled={isSyncing}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {isSyncing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCcw className="h-4 w-4" />
                  )}
                  <span className="sr-only">Resync Project</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Resync project from server</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePush}
                  disabled={isPushing}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {isPushing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <MoveUpLeft className="h-4 w-4" />
                  )}
                  <span className="sr-only">Push Project</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Push project changes</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePull}
                  disabled={isPushing}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {isPulling ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <MoveDownRight className="h-4 w-4" />
                  )}
                  <span className="sr-only">Pull Project</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Pull latest changes</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
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
