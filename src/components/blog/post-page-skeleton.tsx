import { Skeleton } from "@/components/ui/skeleton";

export function PostPageSkeleton() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 md:py-16">
      <header className="mb-12">
        <Skeleton className="h-6 w-24 mb-4 rounded-full" />
        <Skeleton className="h-12 w-full mb-4" />
        <Skeleton className="h-8 w-3/4 mb-6" />
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-5 w-24" />
          </div>
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-5 w-32" />
          </div>
        </div>
      </header>
      
      <Skeleton className="relative w-full h-64 md:h-96 rounded-lg mb-12" />

      <div className="space-y-6 max-w-none">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-5/6" />
        <Skeleton className="h-5 w-full" />
        <br />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />
      </div>

      <footer className="mt-12">
        <div className="flex flex-wrap gap-2 mb-8">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <div className="flex items-center justify-end border-t pt-6">
            <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-28" />
            </div>
        </div>
      </footer>
    </div>
  );
}
