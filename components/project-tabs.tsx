'use client';

import React from 'react';
import { Tabs, TabsList } from '@/components/ui/tabs';
import NewTabButton from './new-tab-button';
import { useParams } from 'next/navigation';
import { useProject } from '@/lib/zustand/store';
import { TabItem } from './tab-item';

export function ProjectTabs() {
  const { project } = useProject();
  const params = useParams();

  const activeTabId = params.slugs ? params.slugs[0] : '';

  return (
    <Tabs value={activeTabId} className="w-full">
      <TabsList className="w-full bg-transparent justify-start">
        {project.children.map((tab) => (
          <TabItem key={tab.slug} doc={tab} />
        ))}
        <NewTabButton />
      </TabsList>
    </Tabs>
  );
}
