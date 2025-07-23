
import { Skeleton } from "@/components/ui/skeleton";

export function AppSkeleton() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header Skeleton */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95">
        <div className="container flex h-16 items-center">
            <div className="mr-auto flex items-center gap-6">
                <div className="flex items-center space-x-2">
                    <Skeleton className="h-6 w-6" />
                    <Skeleton className="h-5 w-20" />
                </div>
                <div className="hidden md:flex items-center space-x-6">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-16" />
                </div>
            </div>
            <div className="hidden md:flex items-center gap-4">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
            </div>
            <div className="md:hidden">
                <Skeleton className="h-9 w-9" />
            </div>
        </div>
      </header>

      {/* Main Content Skeleton */}
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="space-y-8">
                <div className="text-center py-16">
                    <Skeleton className="h-12 w-3/4 mx-auto mb-4" />
                    <Skeleton className="h-6 w-1/2 mx-auto mb-8" />
                    <Skeleton className="h-12 w-48 mx-auto" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <Skeleton className="h-96 w-full" />
                    <Skeleton className="h-96 w-full" />
                    <Skeleton className="h-96 w-full" />
                </div>
            </div>
        </div>
      </main>

      {/* Footer Skeleton */}
      <footer className="border-t">
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
                <Skeleton className="h-6 w-28 mb-4 md:mb-0" />
                <Skeleton className="h-5 w-48 mb-4 md:mb-0" />
                <div className="flex items-center space-x-4">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-16" />
                </div>
            </div>
        </div>
      </footer>
    </div>
  );
}
