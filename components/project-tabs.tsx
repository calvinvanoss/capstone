'use client';

import { useProject } from './project-provider';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export function ProjectTabs({
  mode,
  activeTabId,
}: {
  mode: 'edit' | 'view';
  activeTabId: string;
}) {
  const { project } = useProject();
  const params = useParams();

  if (!project) return null;

  return (
    <Tabs value={activeTabId} className="w-full">
      <TabsList className="w-full h-9 bg-transparent justify-start">
        {project.tabs.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            className="px-3 py-1.5 text-sm font-medium transition-all rounded-md data-[state=active]:bg-muted data-[state=active]:text-foreground"
            asChild
          >
            <Link href={`/project/${params.id}/${mode}/${tab.id}`}>
              {tab.name}
            </Link>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
