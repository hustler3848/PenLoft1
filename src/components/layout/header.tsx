
"use client";

import Link from "next/link";
import { Menu, PenSquare, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { useAuth } from "../auth-provider";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export function Header() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const closeSheet = () => setIsSheetOpen(false);

  const handleSignOut = async () => {
    await signOut(auth);
    toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
    });
    router.push('/');
    closeSheet();
  };

  const getProfileLink = () => {
    // In a real app, the user's ID would be derived from the user object.
    // Since we don't have user profiles in the DB, we'll link to a static one.
    return user ? "/profile/1" : "/sign-in";
  };


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-auto flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <PenSquare className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline text-lg">PenLoft</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Blog
            </Link>
            {user && (
              <Link
                href={getProfileLink()}
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                Profile
              </Link>
            )}
          </nav>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          {user ? (
            <>
               <Link href="/posts/new">
                <Button>
                  Create Post
                  <PenSquare className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button variant="ghost" onClick={handleSignOut}>
                Sign Out
                <LogOut className="ml-2 h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Link href="/sign-in">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/sign-up">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>

        <div className="md:hidden">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-6 p-6">
                <Link href="/" className="flex items-center space-x-2" onClick={closeSheet}>
                  <PenSquare className="h-6 w-6 text-primary" />
                  <span className="font-bold font-headline text-lg">PenLoft</span>
                </Link>
                <nav className="grid gap-4">
                  <Link
                    href="/"
                    onClick={closeSheet}
                    className="font-medium transition-colors hover:text-foreground/80 text-foreground/60"
                  >
                    Blog
                  </Link>
                   {user && (
                     <Link
                        href={getProfileLink()}
                        onClick={closeSheet}
                        className="font-medium transition-colors hover:text-foreground/80 text-foreground/60"
                      >
                        Profile
                      </Link>
                   )}
                   {user && (
                      <Link href="/posts/new" onClick={closeSheet}>
                        <Button className="w-full">
                          Create Post
                          <PenSquare className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                   )}
                </nav>
                <div className="grid gap-4">
                   {user ? (
                        <Button variant="ghost" onClick={handleSignOut} className="w-full">
                            Sign Out
                            <LogOut className="ml-2 h-4 w-4" />
                        </Button>
                   ) : (
                    <>
                        <Link href="/sign-in" onClick={closeSheet}>
                            <Button variant="ghost" className="w-full">Sign In</Button>
                        </Link>
                        <Link href="/sign-up" onClick={closeSheet}>
                            <Button className="w-full">Sign Up</Button>
                        </Link>
                    </>
                   )}
                </div>
                 <div className="absolute bottom-6 left-6">
                    <ThemeToggle />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
