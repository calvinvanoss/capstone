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
import { Eye, GitBranch } from 'lucide-react';
import { fetchProjects } from '@/lib/server-actions';
import { EditProjectDropdown } from './edit-project-dropdown';

export async function ProjectList() {
  const projects = await fetchProjects();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <Card
          key={project.id}
          className="flex flex-col hover:shadow-md transition-shadow duration-200"
        >
          <CardHeader className="relative">
            <EditProjectDropdown
              projectId={project.id}
              projectName={project.name}
              projectDescription={project.description || ''}
            />
            <CardTitle className="text-lg font-semibold">
              {project.name}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              {project.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-xs text-muted-foreground">more info:</p>
          </CardContent>
          <CardFooter className="grid grid-cols-2 gap-2">
            <Link
              href={`/${project.userVersionId}`} // TODO: refactor to project.name/project.version
              className="flex items-center justify-center"
            >
              <Button
                variant="outline"
                className="w-full hover:bg-accent hover:text-accent-foreground"
              >
                <GitBranch className="mr-2 h-4 w-4" />
                Branch/Edit
              </Button>
            </Link>
            <Link
              href={`/${project.currentVersionId}`} // TODO: refactor to project.name/project.version
              className="flex items-center justify-center"
            >
              <Button
                variant="outline"
                className="w-full hover:bg-accent hover:text-accent-foreground"
              >
                <Eye className="mr-2 h-4 w-4" />
                View
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
