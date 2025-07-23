
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BlogCard } from "@/components/blog/blog-card";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getPosts, getUsers } from "@/lib/data";
import type { Post, User } from "@/lib/types";
import { Search } from "lucide-react";
import { BlogCardSkeleton } from "@/components/blog/blog-card-skeleton";
import { useAuth } from "@/components/auth-provider";

const categories = ["Technology", "Lifestyle", "Business", "Creative", "Code"];

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const postsData = await getPosts();
      setPosts(postsData);
      setUsers(getUsers());
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const filtered = posts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPosts(filtered);
      setIsPopoverOpen(true);
    } else {
      setFilteredPosts([]);
      setIsPopoverOpen(false);
    }
  }, [searchQuery, posts]);
  
  const handleWrapperClick = () => {
    if (searchQuery.trim().length <= 1) {
      setIsPopoverOpen(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12" onClick={handleWrapperClick}>
      <section className="text-center py-16 md:py-24">
        <h1 
            className="font-headline text-4xl md:text-6xl font-bold tracking-tighter mb-4 fade-in"
            style={{ animationDelay: '0.2s' }}
        >
          Where Great Ideas Take Flight
        </h1>
        <p 
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 fade-in"
            style={{ animationDelay: '0.3s' }}
        >
          PenLoft is a modern, open space for writers to share their stories and
          for readers to discover captivating content.
        </p>
        
        <div 
            className="max-w-xl mx-auto mb-8 fade-in"
            style={{ animationDelay: '0.4s' }}
        >
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
             <PopoverTrigger asChild>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    ref={searchInputRef}
                    type="search"
                    placeholder="Search for articles..."
                    className="w-full h-12 pl-10 pr-4 text-base"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
            </PopoverTrigger>
            {filteredPosts.length > 0 && (
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-2" align="start">
                    <div className="space-y-2">
                        {filteredPosts.map(post => (
                            <Link href={`/posts/${post.slug}`} key={post.id} className="block">
                                <div className="flex items-center gap-4 p-2 rounded-md hover:bg-secondary transition-colors">
                                    <Image 
                                        src={post.imageUrl}
                                        alt={post.title}
                                        width={64}
                                        height={64}
                                        className="rounded object-cover h-16 w-16"
                                        data-ai-hint="blog post thumbnail"
                                    />
                                    <h4 className="font-medium leading-tight text-sm">{post.title}</h4>
                                </div>
                            </Link>
                        ))}
                    </div>
                </PopoverContent>
            )}
          </Popover>
        </div>

        <Link 
            href={user ? "/posts/new" : "/sign-in"}
            className="fade-in inline-block"
            style={{ animationDelay: '0.5s' }}
        >
          <Button size="lg">Start Writing</Button>
        </Link>
      </section>

      <section className="py-12">
        <div 
            className="flex items-center justify-center flex-wrap gap-2 mb-12 fade-in"
            style={{ animationDelay: '0.6s' }}
        >
          <Badge variant="secondary" className="text-base px-4 py-2">All</Badge>
          {categories.map((category) => (
            <Badge key={category} variant="outline" className="text-base px-4 py-2 cursor-pointer hover:bg-secondary">
              {category}
            </Badge>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <BlogCardSkeleton key={i} />)
          ) : (
            posts.map((post, i) => {
              const author = users.find((user) => user.id === post.authorId);
              return <BlogCard 
                        key={post.id} 
                        post={post} 
                        author={author} 
                        className="fade-in" 
                        style={{ animationDelay: `${0.7 + i * 0.15}s` }}
                     />;
            })
          )}
        </div>
      </section>
    </div>
  );
}
