'use client';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ReactNode } from 'react';

// client component to enable DND, ensuring single instance of HTML5Backend
export default function DndWrapper({ children }: { children: ReactNode }) {
  return <DndProvider backend={HTML5Backend}>{children}</DndProvider>;
}
