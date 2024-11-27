'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Project } from '@/components/project-provider';

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'My First Project',
    description: 'A sample project',
    lastEdited: new Date().toISOString(),
    tabs: [
      {
        id: 'tab1',
        name: 'Home',
        sidebar: [
          { id: '1', name: 'Introduction' },
          { id: '2', name: 'Getting Started' },
        ],
      },
    ],
    activeTab: 'tab1',
  },
  {
    id: '2',
    name: 'Another Project',
    description: 'Just another sample project',
    lastEdited: new Date().toISOString(),
    tabs: [
      {
        id: 'tab1',
        name: 'Main',
        sidebar: [
          { id: '1', name: 'Overview' },
          { id: '2', name: 'Details' },
        ],
      },
    ],
    activeTab: 'tab1',
  },
];

export function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    // Use mock data instead of fetching from API
    setProjects(mockProjects);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <Card key={project.id}>
          <CardHeader>
            <CardTitle>{project.name}</CardTitle>
            <CardDescription>{project.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Last edited: {new Date(project.lastEdited).toLocaleDateString()}
            </p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button asChild>
              <Link href={`/project/${project.id}/edit`}>Edit</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={`/project/${project.id}/view`}>View</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
