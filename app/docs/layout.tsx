import Link from 'next/link';
import { SidebarNavigation } from '@/components/sidebar-navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar className="border-r">
          <SidebarHeader className="border-b px-2 py-2">
            <Link
              href="/docs"
              className="text-lg font-semibold hover:underline"
            >
              Documentation
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <ScrollArea className="h-[calc(100vh-5rem)]">
              <div className="px-2 py-2">
                <SidebarNavigation />
              </div>
            </ScrollArea>
          </SidebarContent>
        </Sidebar>
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </SidebarProvider>
  );
}
