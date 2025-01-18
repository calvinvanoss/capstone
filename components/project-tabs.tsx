'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useProject } from './project-provider';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { useDrag, useDrop } from 'react-dnd';
import { GripHorizontal, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type DragItem = {
  index: number;
  id: string;
  type: string;
};

export function ProjectTabs({
  activeTabId,
  isEditing,
}: {
  activeTabId: string;
  isEditing: boolean;
}) {
  const { project, updateProject, deleteTab, addTab } = useProject();
  const params = useParams();
  const [editingTabId, setEditingTabId] = useState<string | null>(null);
  const [editedTabNames, setEditedTabNames] = useState<{
    [key: string]: string;
  }>({});
  const [inputWidth, setInputWidth] = useState<number>(0);
  const [isAddingTab, setIsAddingTab] = useState(false);
  const [newTabName, setNewTabName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingTabId && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingTabId]);

  if (!project) return null;

  const handleTabClick = (tabId: string) => {
    if (isEditing) {
      setEditingTabId(tabId);
      const tabName = project.tabs.find((tab) => tab.id === tabId)?.name || '';
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
      const updatedTabs = project.tabs.map((tab) =>
        tab.id === editingTabId
          ? { ...tab, name: editedTabNames[editingTabId] || tab.name }
          : tab
      );
      updateProject({ ...project, tabs: updatedTabs });
      setEditingTabId(null);
    }
  };

  const moveTab = (dragIndex: number, hoverIndex: number) => {
    const newTabs = [...project.tabs];
    const draggedTab = newTabs[dragIndex];
    newTabs.splice(dragIndex, 1);
    newTabs.splice(hoverIndex, 0, draggedTab);
    updateProject({ ...project, tabs: newTabs });
  };

  const handleDeleteTab = (tabId: string) => {
    deleteTab(tabId);
  };

  const handleAddTab = () => {
    if (newTabName.trim()) {
      addTab(newTabName.trim());
      setNewTabName('');
      setIsAddingTab(false);
    }
  };

  const TabItem = React.forwardRef<
    HTMLDivElement,
    { tab: (typeof project.tabs)[0]; index: number }
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
          <Link href={`/project/${params.id}/${tab.id}`}>{tab.name}</Link>
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
        {project.tabs.map((tab, index) => (
          <TabItem
            key={tab.id}
            tab={tab}
            index={index}
            ref={React.createRef()}
          />
        ))}
        {isEditing && (
          <TooltipProvider>
            <Tooltip>
              <Dialog open={isAddingTab} onOpenChange={setIsAddingTab}>
                <DialogTrigger asChild>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="ml-2 h-9 w-9"
                    >
                      <Plus className="h-[1.2rem] w-[1.2rem]" />
                      <span className="sr-only">Add Tab</span>
                    </Button>
                  </TooltipTrigger>
                </DialogTrigger>
                <TooltipContent>
                  <p>Add new tab</p>
                </TooltipContent>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Tab</DialogTitle>
                  </DialogHeader>
                  <div className="flex items-center space-x-2">
                    <Input
                      value={newTabName}
                      onChange={(e) => setNewTabName(e.target.value)}
                      placeholder="Enter tab name"
                    />
                    <Button onClick={handleAddTab}>Add</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </Tooltip>
          </TooltipProvider>
        )}
      </TabsList>
    </Tabs>
  );
}
