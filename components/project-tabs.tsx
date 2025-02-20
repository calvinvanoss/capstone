'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { useDrag, useDrop, XYCoord } from 'react-dnd';
import { GripHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Project } from '@/types/project';
import AddTabButton from './add-tab-button';

type DragItem = {
  index: number;
  id: string;
  type: string;
};

export function ProjectTabs({
  project,
  isEditing,
}: {
  project: Project;
  isEditing: boolean;
}) {
  const params = useParams();
  const activeTabId = params.slugs[1] || null;
  const [editingTabId, setEditingTabId] = useState<string | null>(null);
  const [editedTabNames, setEditedTabNames] = useState<{
    [key: string]: string;
  }>({});
  const [inputWidth, setInputWidth] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingTabId && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingTabId]);

  const handleTabClick = (tabId: string) => {
    if (isEditing) {
      setEditingTabId(tabId);
      const tabName =
        project.children.find((tab) => tab.id === tabId)?.name || '';
      setEditedTabNames((prev) => ({ ...prev, [tabId]: tabName }));
      setInputWidth(tabName.length * 8); // Set initial width based on tab name length
    }
  };

  const handleTabNameChange = (tabId: string, newName: string) => {
    setEditedTabNames((prev) => ({ ...prev, [tabId]: newName }));
    setInputWidth(newName.length * 8);
  };

  const handleTabNameBlur = () => {
    if (editingTabId) {
      const updatedTabs = project.children.map((tab) =>
        tab.id === editingTabId
          ? { ...tab, name: editedTabNames[editingTabId] || tab.name }
          : tab
      );
      console.log('update tabs api call');
      setEditingTabId(null);
    }
  };

  const moveTab = (dragIndex: number, hoverIndex: number) => {
    const newTabs = [...project.children];
    const draggedTab = newTabs[dragIndex];
    newTabs.splice(dragIndex, 1);
    newTabs.splice(hoverIndex, 0, draggedTab);
    console.log('update tabs api call');
  };

  const handleDeleteTab = (tabId: string) => {
    console.log('delete tab api call');
  };

  const TabItem = React.forwardRef<
    HTMLDivElement,
    { tab: (typeof project.children)[0]; index: number }
  >(({ tab, index }, ref) => {
    const [{ handlerId }, drop] = useDrop({
      accept: 'tab',
      collect(monitor) {
        return {
          handlerId: monitor.getHandlerId(),
        };
      },
      hover(item: DragItem, monitor) {
        if (!ref || !ref.current) {
          return;
        }
        const dragIndex = item.index;
        const hoverIndex = index;

        if (dragIndex === hoverIndex) {
          return;
        }

        const hoverBoundingRect = ref.current?.getBoundingClientRect();
        const hoverMiddleX =
          (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
        const clientOffset = monitor.getClientOffset();
        const hoverClientX =
          (clientOffset as XYCoord).x - hoverBoundingRect.left;

        if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
          return;
        }

        if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
          return;
        }

        moveTab(dragIndex, hoverIndex);
        item.index = hoverIndex;
      },
    });

    const [{ isDragging }, drag] = useDrag({
      type: 'tab',
      item: () => {
        return { id: tab.id, index };
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    const opacity = isDragging ? 0.5 : 1;
    drag(drop(ref as React.RefObject<HTMLDivElement>));

    return (
      <TabsTrigger
        ref={ref}
        value={tab.id}
        className={`px-3 py-1.5 text-sm font-medium transition-all rounded-md data-[state=active]:bg-muted data-[state=active]:text-foreground flex flex-col items-center justify-between`}
        onClick={() => handleTabClick(tab.id)}
        style={{ opacity }}
        data-handler-id={handlerId}
      >
        {isEditing && (
          <div className="cursor-move w-full flex justify-center mb-1">
            <GripHorizontal size={14} />
          </div>
        )}
        {isEditing && editingTabId === tab.id ? (
          <Input
            value={editedTabNames[tab.id] || tab.name}
            onChange={(e) => handleTabNameChange(tab.id, e.target.value)}
            onBlur={handleTabNameBlur}
            className="h-6 py-0 px-1 text-sm bg-transparent border-none focus:ring-0"
            style={{ width: `${inputWidth}px` }}
            autoFocus
            ref={inputRef}
          />
        ) : isEditing ? (
          <span>{editedTabNames[tab.id] || tab.name}</span>
        ) : (
          <Link href={`/dashboard/${project.id}/${tab.id}`}>{tab.name}</Link>
        )}
        {isEditing && (
          <Button
            variant="ghost"
            size="sm"
            className="p-0 h-4 w-4 mt-1"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteTab(tab.id);
            }}
          >
            <X size={14} />
          </Button>
        )}
      </TabsTrigger>
    );
  });

  TabItem.displayName = 'TabItem';

  return (
    <Tabs value={activeTabId} className="w-full">
      <TabsList className="w-full bg-transparent justify-start">
        {project.children.map((tab, index) => (
          <TabItem
            key={tab.id}
            tab={tab}
            index={index}
            ref={React.createRef()}
          />
        ))}
        <AddTabButton project={project} />
      </TabsList>
    </Tabs>
  );
}
