'use client';

import { useProject } from './project-provider';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function ProjectHome({ mode }: { mode: 'edit' | 'view' }) {
  const { project, updateProject } = useProject();
  const [editableContent, setEditableContent] = useState({
    description: project?.description || '',
    content: `
      <h2>Welcome to Your Project</h2>
      <p>This is the landing page for your project. You can customize this content to provide an overview, instructions, or any other relevant information about your project.</p>
      <h3>Getting Started</h3>
      <ul>
        <li>Use the tabs above to navigate between different sections of your project.</li>
        <li>Each tab may have its own sidebar for further navigation.</li>
        <li>Edit your project content using the edit mode.</li>
      </ul>
    `,
  });

  if (!project) return <div>Loading...</div>;

  const handleContentChange = (
    field: 'description' | 'content',
    value: string
  ) => {
    setEditableContent((prev) => ({ ...prev, [field]: value }));
  };

  const saveChanges = () => {
    updateProject({
      ...project,
      description: editableContent.description,
    });
    // In a real app, you'd also save the content to your backend
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow">
        {mode === 'edit' ? (
          <textarea
            className="w-full p-2 mb-8 border rounded"
            value={editableContent.description}
            onChange={(e) => handleContentChange('description', e.target.value)}
          />
        ) : (
          <p className="text-lg text-muted-foreground mb-8">
            {project.description}
          </p>
        )}
        <div className="prose max-w-none">
          {mode === 'edit' ? (
            <textarea
              className="w-full h-[300px] p-2 border rounded"
              value={editableContent.content}
              onChange={(e) => handleContentChange('content', e.target.value)}
            />
          ) : (
            <div
              dangerouslySetInnerHTML={{ __html: editableContent.content }}
            />
          )}
        </div>
        {mode === 'edit' && (
          <Button onClick={saveChanges} className="mt-4">
            Save Changes
          </Button>
        )}
      </div>
    </div>
  );
}
