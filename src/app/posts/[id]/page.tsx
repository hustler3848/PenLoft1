import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getPost, getUser } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { EngagementButtons } from "@/components/blog/engagement-buttons";
import { format } from "date-fns";
import { Calendar, User as UserIcon } from "lucide-react";

export default function PostPage({ params }: { params: { id: string } }) {
  const post = getPost(params.id);

  if (!post) {
    notFound();
  }

  const author = getUser(post.authorId);

  return (
    <article className="container mx-auto max-w-4xl px-4 py-8 md:py-16">
      <header className="mb-12">
        <div className="mb-4">
          <Badge>{post.category}</Badge>
        </div>
        <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          {post.title}
        </h1>
        <div className="flex items-center space-x-6 text-muted-foreground">
          {author && (
            <Link href={`/profile/${author.id}`} className="flex items-center space-x-2 hover:text-foreground">
              <Avatar className="h-8 w-8">
                <AvatarImage src={author.avatarUrl} alt={author.name} />
                <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="font-medium">{author.name}</span>
            </Link>
          )}
           <div className="flex items-center space-x-2">
             <Calendar className="h-4 w-4" />
            <time dateTime={post.createdAt}>
              {format(new Date(post.createdAt), "MMMM d, yyyy")}
            </time>
          </div>
        </div>
      </header>
      
      <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden mb-12 shadow-lg">
        <Image 
            src={post.imageUrl}
            alt={post.title}
            fill
            className="object-cover"
            priority
            data-ai-hint="blog post illustration"
        />
      </div>

      <div className="prose prose-lg dark:prose-invert max-w-none text-foreground/90 text-lg leading-relaxed font-body">
        {post.content.split('\\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      <footer className="mt-12">
        <div className="flex flex-wrap gap-2 mb-8">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>
        <div className="flex items-center justify-end border-t pt-6">
          <EngagementButtons initialLikes={post.likes} initialBookmarked={post.isBookmarked} showLabels />
        </div>
      </footer>
    </article>
  );
}
