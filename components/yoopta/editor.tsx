'use client';

import YooptaEditor, {
  createYooptaEditor,
  type YooptaContentValue,
  type YooptaOnChangeOptions,
} from '@yoopta/editor';
import { useEffect, useMemo, useState } from 'react';
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
import { getDocContent, updateDocContent } from '@/lib/server-actions';
import { useProject } from '@/lib/store';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { RotateCcw, Save } from 'lucide-react';
import { Button } from '../ui/button';

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

export default function Editor({ path }: { path: string }) {
  const { project } = useProject();
  const editor = useMemo(() => createYooptaEditor(), []);
  const [savedContent, setSavedContent] = useState<
    YooptaContentValue | undefined
  >();
  const [content, setContent] = useState<YooptaContentValue | undefined>();
  const [renderkey, setRenderKey] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      const blockContent = await getDocContent(project.versionId, path);
      setSavedContent(blockContent.content as YooptaContentValue | undefined);
      setContent(blockContent.content as YooptaContentValue | undefined);
      setIsLoading(false);
    };
    fetchContent();
  }, [path, project.versionId]);

  const isModified = savedContent !== content;

  const onChange = (
    value: YooptaContentValue,
    options: YooptaOnChangeOptions
  ) => {
    setContent(value);
  };

  const handleUndo = async () => {
    setContent(savedContent);
    setRenderKey(!renderkey);
  };

  const handleSave = () => {
    if (content) {
      setSavedContent(content);
      updateDocContent(project.versionId, path, content);
    }
  };

  if (isLoading) return null;
  return (
    <div className="flex-1">
      <div className="mb-4 flex space-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleUndo}
                disabled={!isModified}
                className="text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="h-4 w-4" />
                <span className="sr-only">Undo</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Undo local changes</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSave}
                disabled={!isModified}
                className="text-muted-foreground hover:text-foreground"
              >
                <Save className="h-4 w-4" />
                <span className="sr-only">Save</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Save local changes</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="border border-gray-300 rounded-md p-2">
        <YooptaEditor
          key={renderkey ? 'rkeyt' : 'rkeyf'}
          editor={editor}
          plugins={plugins}
          value={content}
          onChange={onChange}
          tools={TOOLS}
          marks={MARKS}
          autoFocus
        />
      </div>
    </div>
  );
}
