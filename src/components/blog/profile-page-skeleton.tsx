import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BlogCardSkeleton } from "./blog-card-skeleton";

export function ProfilePageSkeleton() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 md:py-12">
      <Card className="mb-12 overflow-hidden">
        <Skeleton className="h-32 w-full" />
        <CardContent className="p-6 pt-0">
          <div className="flex items-end -mt-16">
            <Skeleton className="h-32 w-32 rounded-full border-4 border-background" />
            <div className="ml-auto">
                <Skeleton className="h-10 w-24" />
            </div>
          </div>
         
          <div className="mt-4">
            <Skeleton className="h-8 w-48 mb-3" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-3/4 mt-2" />
          </div>

          <div className="mt-6 flex items-center space-x-6 border-t pt-4">
              <div className="text-center">
                  <Skeleton className="h-6 w-8 mx-auto mb-1" />
                  <Skeleton className="h-4 w-12 mx-auto" />
              </div>
               <div className="text-center">
                  <Skeleton className="h-6 w-12 mx-auto mb-1" />
                  <Skeleton className="h-4 w-10 mx-auto" />
              </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <Skeleton className="h-8 w-56 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <BlogCardSkeleton />
          <BlogCardSkeleton />
          <BlogCardSkeleton />
        </div>
      </div>
    </div>
  );
}
