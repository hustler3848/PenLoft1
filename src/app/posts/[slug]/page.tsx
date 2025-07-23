
"use client";

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getPostBySlug, getUser, getPosts, getUsers } from "@/lib/data";
import type { Post, User } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { EngagementButtons } from "@/components/blog/engagement-buttons";
import { format } from "date-fns";
import { Calendar } from "lucide-react";
import { PostPageSkeleton } from "@/components/blog/post-page-skeleton";
import { BlogCard } from "@/components/blog/blog-card";

export default function PostPage({ params }: { params: { slug: string } }) {
  const [post, setPost] = useState<Post | null | undefined>(undefined);
  const [author, setAuthor] = useState<User | null | undefined>(undefined);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const slug = params.slug;
    const fetchData = async () => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      const postData = getPostBySlug(slug);
      
      if (postData) {
        const authorData = getUser(postData.authorId);
        setPost(postData);
        setAuthor(authorData);

        const allPostsData = getPosts();
        const related = allPostsData
          .filter(p => p.category === postData.category && p.id !== postData.id)
          .slice(0, 3);
        setRelatedPosts(related);
        setAllUsers(getUsers());
      } else {
        setPost(null);
      }
      setLoading(false);
    };
    fetchData();
  }, [params.slug]);

  if (loading) {
    return <PostPageSkeleton />;
  }

  if (!post || !author) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 md:py-16">
        <article className="fade-in">
        <header className="mb-12">
            <div className="mb-4">
            <Badge>{post.category}</Badge>
            </div>
            <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            {post.title}
            </h1>
            <div className="flex items-center space-x-6 text-muted-foreground">
            {author && (
                <Link href={`/profile/${author.username}`} className="flex items-center space-x-2 hover:text-foreground">
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

        {relatedPosts.length > 0 && (
            <section className="mt-16 pt-12 border-t">
                <h2 className="font-headline text-3xl font-bold mb-8 text-center">Related Posts</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {relatedPosts.map(relatedPost => {
                        const relatedAuthor = allUsers.find(user => user.id === relatedPost.authorId);
                        return (
                           <BlogCard key={relatedPost.id} post={relatedPost} author={relatedAuthor} />
                        )
                    })}
                </div>
            </section>
        )}
    </div>
  );
}
