'use client';

import type React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

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
  updateProjectName: (newName: string) => void;
  updateTabName: (tabId: string, newName: string) => void;
  reorderTabs: (newTabOrder: Tab[]) => void;
  deleteTab: (tabId: string) => void;
  addTab: (tabName: string) => void;
  addProject: (newProject: Project) => void;
};

const ProjectContext = createContext<ProjectContextType>({
  project: null,
  updateProject: () => {},
  updateProjectName: () => {},
  updateTabName: () => {},
  reorderTabs: () => {},
  deleteTab: () => {},
  addTab: () => {},
  addProject: () => {},
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

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    // Simulate API call with the hardcoded example
    setTimeout(() => {
      setProject(exampleProject);
    }, 500); // Simulate a short delay
  }, []);

  const updateProject = (updatedProject: Project) => {
    setProject(updatedProject);
    // In a real scenario, you would send the updated project to your API here
    console.log('Project updated:', updatedProject);
  };

  const updateProjectName = (newName: string) => {
    if (project) {
      const updatedProject = { ...project, name: newName };
      setProject(updatedProject);
      // In a real scenario, you would send the updated project name to your API here
      console.log('Project name updated:', newName);
    }
  };

  const updateTabName = (tabId: string, newName: string) => {
    if (project) {
      const updatedTabs = project.tabs.map((tab) =>
        tab.id === tabId ? { ...tab, name: newName } : tab
      );
      const updatedProject = { ...project, tabs: updatedTabs };
      setProject(updatedProject);
      // In a real scenario, you would send the updated tab name to your API here
      console.log('Tab name updated:', tabId, newName);
    }
  };

  const reorderTabs = (newTabOrder: Tab[]) => {
    if (project) {
      const updatedProject = { ...project, tabs: newTabOrder };
      setProject(updatedProject);
      // In a real scenario, you would send the updated tab order to your API here
      console.log('Tabs reordered:', newTabOrder);
    }
  };

  const deleteTab = (tabId: string) => {
    if (project) {
      const updatedTabs = project.tabs.filter((tab) => tab.id !== tabId);
      const updatedProject = { ...project, tabs: updatedTabs };
      setProject(updatedProject);
      // In a real scenario, you would send the delete request to your API here
      console.log('Tab deleted:', tabId);
    }
  };

  const addTab = (tabName: string) => {
    if (project) {
      const newTab: Tab = {
        id: `tab-${Date.now()}`, // Generate a unique ID
        name: tabName,
        sidebar: [], // Initialize with an empty sidebar
      };
      const updatedProject = { ...project, tabs: [...project.tabs, newTab] };
      setProject(updatedProject);
      // In a real scenario, you would send the new tab to your API here
      console.log('New tab added:', newTab);
    }
  };

  const addProject = (newProject: Project) => {
    // In a real scenario, you would send the new project to your API here
    console.log('New project added:', newProject);
    // Optionally, you could update the local state if you're keeping a list of projects
    // setProjects(prevProjects => [...prevProjects, newProject])
  };

  return (
    <ProjectContext.Provider
      value={{
        project,
        updateProject,
        updateProjectName,
        updateTabName,
        reorderTabs,
        deleteTab,
        addTab,
        addProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export const useProject = () => useContext(ProjectContext);
