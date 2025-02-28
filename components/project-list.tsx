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
import { DeleteButton } from '@/components/delete-button';
import { getProjects } from '@/lib/server-actions';
import { EditProjectDropdown } from './edit-project-dropdown';

export async function ProjectList() {
  const projects = await getProjects();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <Card
          key={project.projects.id}
          className="flex flex-col hover:shadow-md transition-shadow duration-200"
        >
          <CardHeader className="relative">
            <EditProjectDropdown />
            <CardTitle className="text-lg font-semibold">
              {project.projects.name}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              {project.projects.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-xs text-muted-foreground">more info:</p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              asChild
              variant="outline"
              className="hover:bg-accent hover:text-accent-foreground"
            >
              <Link
                href={`/${project.projects.id}`}
                prefetch={false}
                className="flex items-center justify-center"
              >
                Open Project
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <DeleteButton projectId={project.projects.id} />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

/*

            */
