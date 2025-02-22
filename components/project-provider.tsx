'use client';

import { useProject } from '@/lib/zustand/store';
import { Project } from '@/types/project';
import { useEffect, useState } from 'react';

export function ProjectProvider({
  project,
  children,
}: {
  project: Project;
  children: React.ReactNode;
}) {
  const { setProject } = useProject();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setProject(project);
    setIsLoading(false);
  }, [project, setProject]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return children;
}
