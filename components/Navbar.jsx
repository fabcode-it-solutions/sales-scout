'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Target, Menu, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/ModeToggle';

export default function Navbar() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="border-b bg-background/50 backdrop-blur-xl sticky top-0 z-50 border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <img
                src="/favicon.ico"
                alt="SalesScout"
                className="h-8 w-8"
              />
              <span className="text-xl font-bold text-foreground">
                SalesScout
              </span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <ModeToggle />
            {user ? (
              <>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">Welcome, {user.name}</span>
                  <Button variant="ghost" asChild>
                    <Link href="/profile">Profile</Link>
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="text-muted-foreground hover:text-foreground">Log in</Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button - Only show if NOT logged in, because logged in users have Sidebar toggle in Layout */}
          {!user && (
            <div className="md:hidden flex items-center gap-2">
              <ModeToggle />
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          )}
          
          {/* Mobile Menu Button for Logged in users (Sidebar toggle is elsewhere, but they might need theme toggle) */}
          {user && (
             <div className="md:hidden flex items-center gap-2">
                <ModeToggle />
             </div>
          )}
        </div>
      </div>

      {/* Mobile Menu - Only for non-logged in users */}
      {isOpen && !user && (
        <div className="md:hidden border-t bg-background">
          <div className="px-4 pt-2 pb-6 space-y-2 flex flex-col">
            <Link 
              href="/login" 
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              Log in
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
