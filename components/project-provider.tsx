'use client';

import { useProject } from '@/lib/store';
import { ProjectVersion } from '@/lib/types';
import { useEffect, useState } from 'react';

export function ProjectProvider({
  project,
  children,
}: {
  project: ProjectVersion;
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
