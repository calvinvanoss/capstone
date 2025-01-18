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
import { ArrowRight } from 'lucide-react';

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
          {
            id: '1',
            name: 'Introduction',
            slug: 'introduction',
            type: 'document',
          },
          {
            id: '2',
            name: 'Getting Started',
            slug: 'getting-started',
            type: 'document',
          },
        ],
      },
    ],
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
          { id: '1', name: 'Overview', slug: 'overview', type: 'document' },
          { id: '2', name: 'Details', slug: 'details', type: 'document' },
        ],
      },
    ],
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
        <Card
          key={project.id}
          className="flex flex-col hover:shadow-md transition-shadow duration-200"
        >
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              {project.name}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              {project.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-xs text-muted-foreground">
              Last edited: {new Date(project.lastEdited).toLocaleDateString()}
            </p>
          </CardContent>
          <CardFooter>
            <Button
              asChild
              variant="outline"
              className="w-full hover:bg-accent hover:text-accent-foreground"
            >
              <Link
                href={`/project/${project.id}`}
                className="flex items-center justify-center"
              >
                Open Project
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
