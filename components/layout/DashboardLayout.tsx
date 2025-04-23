"use client"

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Home, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const userInitials = user?.email 
    ? user.email.substring(0, 2).toUpperCase()
    : 'UN';

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b bg-background sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden mr-2">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <div className="flex items-center mb-6 mt-2">
                  <FileText className="h-6 w-6 text-primary mr-2" />
                  <span className="text-lg font-bold">NoteGenius</span>
                </div>
                <nav className="flex flex-col space-y-1">
                  <Link 
                    href="/dashboard" 
                    className="flex items-center py-2 px-3 rounded-md hover:bg-secondary"
                    onClick={() => setIsOpen(false)}
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Dashboard
                  </Link>
                  <Button 
                    variant="ghost" 
                    className="flex items-center justify-start py-2 px-3 rounded-md hover:bg-secondary"
                    onClick={() => {
                      handleSignOut();
                      setIsOpen(false);
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
            
            <Link href="/dashboard" className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold hidden md:inline">NoteGenius</span>
            </Link>
            
            <nav className="hidden md:flex ml-6 space-x-4">
              <Link 
                href="/dashboard" 
                className="px-3 py-2 rounded-md hover:bg-secondary transition-colors"
              >
                Dashboard
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-3">
            <ThemeToggle />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{userInitials}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  {user?.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="flex-1 bg-muted/30">
        {children}
      </main>

      <footer className="border-t bg-background py-3">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>© 2025 NoteGenius. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}