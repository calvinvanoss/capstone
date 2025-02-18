'use client';

import { useState, useEffect, useCallback } from 'react';
import { EditButton } from './edit-button';
import Editor from './yoopta/editor';

export function ProjectContent({
  path,
  projectId,
}: {
  path: string;
  projectId: string;
}) {
  const [content, setContent] = useState('');
  const [localContent, setLocalContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Fetch content when path changes
  useEffect(() => {
    // In a real implementation, you'd fetch the actual content based on the path
    const fetchedContent = `<h2 class="text-2xl font-bold mb-4">Content for path: ${path}</h2><p class="mb-4">This is editable content.</p>`;
    setContent(fetchedContent);
    setLocalContent(fetchedContent);
  }, [path]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setContent(localContent);
    setIsEditing(false);
    // api call
  };

  const handleCancel = () => {
    setLocalContent(content);
    setIsEditing(false);
  };

  return (
    <div className="flex-1">
      <div className="mb-4">
        <EditButton
          isEditing={isEditing}
          onEdit={handleEdit}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
      <Editor isEditing={isEditing} />
    </div>
  );
}
