import Link from "next/link";
import Image from "next/image";
import type { Post, User } from "@/lib/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { EngagementButtons } from "./engagement-buttons";
import { format } from 'date-fns';
import { cn } from "@/lib/utils";

interface BlogCardProps {
  post: Post;
  author?: User;
  className?: string;
  style?: React.CSSProperties;
}

export function BlogCard({ post, author, className, style }: BlogCardProps) {
  if (!post) return null;

  const postExcerpt = post.content.substring(0, 100) + "...";

  return (
    <Card asChild style={style} className={cn("flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1", className)}>
      <Link href={`/posts/${post.id}`}>
        <CardHeader className="p-0">
          <div className="relative h-48 w-full">
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              className="object-cover"
              data-ai-hint="blog post cover"
            />
             <Badge className="absolute top-3 right-3">{post.category}</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6 flex-grow">
          <CardTitle className="font-headline text-xl mb-2 leading-tight">
            {post.title}
          </CardTitle>
          <div className="flex items-center text-sm text-muted-foreground mb-4">
            {author && (
              <div className="flex items-center mr-4">
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarImage src={author.avatarUrl} alt={author.name} />
                  <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>{author.name}</span>
              </div>
            )}
            <time dateTime={post.createdAt}>{format(new Date(post.createdAt), 'MMM d, yyyy')}</time>
          </div>
          <p className="text-muted-foreground">{postExcerpt}</p>
        </CardContent>
        <CardFooter className="p-6 pt-0 flex flex-col items-start gap-4">
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
           <div className="w-full flex justify-end">
             <EngagementButtons initialLikes={post.likes} initialBookmarked={post.isBookmarked} />
           </div>
        </CardFooter>
      </Link>
    </Card>
  );
}
