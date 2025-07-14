import Link from "next/link";
import { PenSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export function Header() {
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
            <SignedIn>
                <Link
                href="/user-profile"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
                >
                Profile
                </Link>
            </SignedIn>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
            <Link href="/posts/new">
                <Button>
                Create Post
                <PenSquare className="ml-2 h-4 w-4" />
                </Button>
            </Link>
          </SignedIn>
          <SignedOut>
             <Link href="/sign-in">
                <Button variant="ghost">
                    Sign In
                </Button>
            </Link>
            <Link href="/sign-up">
                <Button>
                    Sign Up
                </Button>
            </Link>
          </SignedOut>
        </div>
      </div>
    </header>
  );
}
