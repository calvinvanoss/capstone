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
import { ArrowRight } from 'lucide-react';
import { cookiesClient } from '@/lib/amplify-utils';

async function getProjects() {
  const { data: projects, errors } = await cookiesClient.models.Project.list();

  return projects;
}

export async function ProjectList() {
  const projects = await getProjects();

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
              Last edited: {new Date(project.updatedAt).toLocaleDateString()}
            </p>
          </CardContent>
          <CardFooter>
            <Button
              asChild
              variant="outline"
              className="w-full hover:bg-accent hover:text-accent-foreground"
            >
              <Link
                href={`/dashboard/${project.id}`}
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
