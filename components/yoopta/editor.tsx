'use client';

import YooptaEditor, {
  createYooptaEditor,
  type YooptaContentValue,
  type YooptaOnChangeOptions,
} from '@yoopta/editor';
import { useMemo, useState } from 'react';
import Paragraph from '@yoopta/paragraph';
import Blockquote from '@yoopta/blockquote';
import LinkTool, { DefaultLinkToolRender } from '@yoopta/link-tool';
import ActionMenu, { DefaultActionMenuRender } from '@yoopta/action-menu-list';
import Toolbar, { DefaultToolbarRender } from '@yoopta/toolbar';
import {
  Bold,
  Italic,
  CodeMark,
  Underline,
  Strike,
  Highlight,
} from '@yoopta/marks';

import Embed from '@yoopta/embed';
import Image from '@yoopta/image';
import Link from '@yoopta/link';
import Callout from '@yoopta/callout';
import Video from '@yoopta/video';
import File from '@yoopta/file';
import Accordion from '@yoopta/accordion';
import { NumberedList, BulletedList, TodoList } from '@yoopta/lists';
import { HeadingOne, HeadingThree, HeadingTwo } from '@yoopta/headings';
import Code from '@yoopta/code';
import Table from '@yoopta/table';
import Divider from '@yoopta/divider';
import { EditButton } from '../edit-button';
import { Document } from '@/types/project';
import { updateDocument } from '@/lib/server-actions';
import { useProject } from '@/lib/zustand/store';

const MARKS = [Bold, Italic, CodeMark, Underline, Strike, Highlight];

// bypassed type checking for Table and Accordion for now
const plugins: any = [
  Paragraph,
  Blockquote,
  Divider.extend({
    elementProps: {
      divider: (props) => ({
        ...props,
        color: '#007aff',
      }),
    },
  }),
  HeadingOne,
  HeadingTwo,
  HeadingThree,
  NumberedList,
  BulletedList,
  TodoList,
  Code,
  Link,
  Embed,
  Image,
  Video,
  File,
  Callout,
  Table,
  Accordion,
];

const TOOLS = {
  Toolbar: {
    tool: Toolbar,
    render: DefaultToolbarRender,
  },
  ActionMenu: {
    tool: ActionMenu,
    render: DefaultActionMenuRender,
  },
  LinkTool: {
    tool: LinkTool,
    render: DefaultLinkToolRender,
  },
};

export default function Editor({
  slugs,
  document,
}: {
  slugs: string[];
  document: Document;
}) {
  const { project } = useProject();
  const editor = useMemo(() => createYooptaEditor(), []);
  const [value, setValue] = useState<YooptaContentValue | undefined>(
    document.content || undefined
  );
  const [savedValue, setSavedValue] = useState<YooptaContentValue | undefined>(
    document.content || undefined
  );
  const [isEditing, setIsEditing] = useState(false);

  const onChange = (
    value: YooptaContentValue,
    options: YooptaOnChangeOptions
  ) => {
    setValue(value);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setSavedValue(value);
    setIsEditing(false);
    if (value != undefined) {
      if (document) {
        updateDocument(project.id, slugs.join('/'), value);
      }
    }
  };

  const handleCancel = () => {
    setValue(savedValue);
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
      <div className="border border-gray-300 rounded-md p-2">
        <YooptaEditor
          key={isEditing ? 'editing' : 'readonly'} // forces rerender
          editor={editor}
          plugins={plugins}
          value={value}
          onChange={onChange}
          tools={TOOLS}
          marks={MARKS}
          readOnly={!isEditing}
          autoFocus
        />
      </div>
    </div>
  );
}
