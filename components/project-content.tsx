'use client';

import { useState, useEffect } from 'react';
import { useProject } from './project-provider';
import { Button } from '@/components/ui/button';
import BlockEditor from '@/app/components/TipTap/BlockEditor';

export function ProjectContent({
  mode,
  path,
}: {
  mode: 'edit' | 'view';
  path: string;
}) {
  const { project } = useProject();
  const [content, setContent] = useState('');

  useEffect(() => {
    // In a real implementation, you'd fetch the actual content based on the path
    setContent(`Content for path: ${path}`);
  }, [path]);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    // In a real implementation, you'd save the content to your backend here
  };

  return (
    <div className="flex-1">
      {mode === 'edit' ? (
        <BlockEditor />
      ) : (
        <div className="prose max-w-none">{content}</div>
      )}
      {mode === 'edit' && (
        <Button onClick={() => console.log('Save changes')} className="mt-4">
          Save Changes
        </Button>
      )}
    </div>
  );
}
