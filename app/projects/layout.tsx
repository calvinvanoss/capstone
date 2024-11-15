'use client';

import { useState, useEffect } from 'react';
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
import { Search, Palette } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { colorSchemes, ColorScheme } from '@/lib/color-schemes';

const themes: { name: string; value: ColorScheme }[] = [
  { name: 'Light', value: 'light' },
  { name: 'Dark', value: 'dark' },
  { name: 'Coffee', value: 'coffee' },
];

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<ColorScheme>(
    (localStorage.getItem('theme') as ColorScheme) || 'light'
  );

  useEffect(() => {
    const root = window.document.documentElement;
    const colors = colorSchemes[theme];

    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });

    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as ColorScheme | null;
    if (storedTheme && storedTheme in colorSchemes) {
      setTheme(storedTheme);
    }
  }, []);

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
            <div className="flex items-center space-x-4">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search documentation..."
                  className="pl-8 w-full"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Palette className="h-[1.2rem] w-[1.2rem]" />
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {themes.map((t) => (
                    <DropdownMenuItem
                      key={t.value}
                      onClick={() => setTheme(t.value)}
                    >
                      {t.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
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
