import Link from 'next/link';
import { SidebarNavigation } from '@/components/sidebar-navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex flex-col min-h-screen w-full">
        <header className="sticky top-0 z-40 w-full border-b bg-background">
          <div className="flex h-14 items-center justify-between px-4 md:px-6 max-w-[1400px] mx-auto w-full">
            <div className="flex items-center flex-1">
              <SidebarTrigger className="mr-2" />
              <Link href="/docs" className="font-bold hover:underline">
                Documentation
              </Link>
            </div>
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search documentation..."
                className="pl-8 w-full"
              />
            </div>
          </div>
        </header>
        <div className="flex-1 flex w-full">
          <Sidebar className="hidden md:block border-r w-64">
            <SidebarContent className="pt-14">
              <ScrollArea className="h-[calc(100vh-3.5rem)]">
                <div className="space-y-4">
                  <div className="px-3 py-2">
                    <div className="space-y-1">
                      <SidebarNavigation />
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </SidebarContent>
          </Sidebar>
          <main className="flex-1 w-full">
            <ScrollArea className="h-[calc(100vh-3.5rem)] w-full">
              <div className="max-w-[1400px] mx-auto px-4 md:px-6 w-full">
                {children}
              </div>
            </ScrollArea>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
