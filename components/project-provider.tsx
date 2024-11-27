'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type SidebarItem = {
  id: string;
  name: string;
  slug: string;
  type: 'folder' | 'document';
  children?: SidebarItem[];
};

type Tab = {
  id: string;
  name: string;
  sidebar: SidebarItem[];
};

export type Project = {
  id: string;
  name: string;
  description: string;
  lastEdited: string;
  tabs: Tab[];
};

type ProjectContextType = {
  project: Project | null;
  updateProject: (updatedProject: Project) => void;
};

const ProjectContext = createContext<ProjectContextType>({
  project: null,
  updateProject: () => {},
});

// Example project data (abbreviated for brevity)
const exampleProject: Project = {
  id: '1',
  name: 'My Docusaurus-like Project',
  description: 'An example project with multiple tabs and nested sidebars',
  lastEdited: new Date().toISOString(),
  tabs: [
    {
      id: 'docs',
      name: 'Docs',
      sidebar: [
        {
          id: '1',
          name: 'Getting Started',
          slug: 'getting-started',
          type: 'folder',
          children: [
            {
              id: '1.1',
              name: 'Introduction',
              slug: 'introduction',
              type: 'document',
            },
            {
              id: '1.2',
              name: 'Installation',
              slug: 'installation',
              type: 'document',
            },
          ],
        },
        // ... other sidebar items
        {
          id: '2',
          name: 'Core Concepts',
          slug: 'core-concepts',
          type: 'folder',
          children: [
            {
              id: '2.1',
              name: 'Project Structure',
              slug: 'project-structure',
              type: 'document',
            },
            {
              id: '2.2',
              name: 'Plugins',
              slug: 'plugins',
              type: 'folder',
              children: [
                {
                  id: '2.2.1',
                  name: 'Overview',
                  slug: 'plugins-overview',
                  type: 'document',
                },
                {
                  id: '2.2.2',
                  name: 'Creating Plugins',
                  slug: 'creating-plugins',
                  type: 'document',
                },
              ],
            },
            { id: '2.3', name: 'Themes', slug: 'themes', type: 'document' },
          ],
        },
        {
          id: '3',
          name: 'API Reference',
          slug: 'api-reference',
          type: 'document',
        },
      ],
    },
    // ... other tabs
    {
      id: 'tutorial',
      name: 'Tutorial',
      sidebar: [
        {
          id: '4',
          name: 'Tutorial Intro',
          slug: 'tutorial-intro',
          type: 'document',
        },
        {
          id: '5',
          name: 'Basics',
          slug: 'basics',
          type: 'folder',
          children: [
            {
              id: '5.1',
              name: 'Create a Page',
              slug: 'create-a-page',
              type: 'document',
            },
            {
              id: '5.2',
              name: 'Create a Document',
              slug: 'create-a-document',
              type: 'document',
            },
            {
              id: '5.3',
              name: 'Create a Blog Post',
              slug: 'create-a-blog-post',
              type: 'document',
            },
          ],
        },
        {
          id: '6',
          name: 'Advanced',
          slug: 'advanced',
          type: 'folder',
          children: [
            {
              id: '6.1',
              name: 'Manage Docs Versions',
              slug: 'manage-docs-versions',
              type: 'document',
            },
            {
              id: '6.2',
              name: 'Translate Your Site',
              slug: 'translate-your-site',
              type: 'document',
            },
          ],
        },
      ],
    },
    {
      id: 'blog',
      name: 'Blog',
      sidebar: [
        { id: '7', name: 'Welcome', slug: 'welcome', type: 'document' },
        { id: '8', name: 'Hello World', slug: 'hello-world', type: 'document' },
        {
          id: '9',
          name: 'Markdown Features',
          slug: 'markdown-features',
          type: 'document',
        },
      ],
    },
  ],
};

export function ProjectProvider({
  children,
  projectId,
}: {
  children: React.ReactNode;
  projectId: string;
}) {
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    // Simulate API call with the hardcoded example
    setTimeout(() => {
      setProject(exampleProject);
    }, 500); // Simulate a short delay
  }, [projectId]);

  const updateProject = (updatedProject: Project) => {
    setProject(updatedProject);
    // In a real scenario, you would send the updated project to your API here
    console.log('Project updated:', updatedProject);
  };

  return (
    <ProjectContext.Provider value={{ project, updateProject }}>
      {children}
    </ProjectContext.Provider>
  );
}

export const useProject = () => useContext(ProjectContext);
