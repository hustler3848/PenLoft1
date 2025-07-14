import { PenSquare } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <PenSquare className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline text-lg">PenLoft</span>
          </div>
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">
            © {new Date().getFullYear()} PenLoft. All rights reserved.
          </p>
          <div className="flex items-center space-x-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Twitter
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              GitHub
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
