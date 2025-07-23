
"use client";

import { useState, useEffect } from 'react';
import { notFound } from "next/navigation";
import { getUserByUsername, getPosts, getUsers } from "@/lib/data";
import type { User, Post } from '@/lib/types';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProfilePageSkeleton } from '@/components/blog/profile-page-skeleton';
import { PostList } from '@/components/blog/post-list';

export default function ProfilePage({ params }: { params: { username: string } }) {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const username = params.username;

  useEffect(() => {
    if (!username) return; // Don't fetch data if username is not available yet

    const fetchData = async () => {
      setLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const userData = getUserByUsername(username);
      
      if (userData) {
        setUser(userData);
        const allPostsData = getPosts();
        setUserPosts(allPostsData.filter(post => post.authorId === userData.id));
        setAllUsers(getUsers());
      } else {
        setUser(null);
      }
      setLoading(false);
    };
    fetchData();
  }, [username]);

  if (loading) {
    return <ProfilePageSkeleton />;
  }

  if (!user) {
    notFound();
  }
  
  const totalLikes = userPosts.reduce((acc, post) => acc + post.likes, 0);

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 md:py-12 fade-in">
      <Card className="mb-12 overflow-hidden">
        <div className="h-32 bg-muted" data-ai-hint="header background" />
        <CardContent className="p-6 pt-0">
          <div className="flex items-end -mt-16">
             <Avatar className="h-32 w-32 border-4 border-background">
              <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="person" />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
         
          <div className="mt-4">
            <h1 className="font-headline text-3xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground mt-2">@{user.username}</p>
            <p className="text-muted-foreground mt-2">{user.bio}</p>
          </div>

          <div className="mt-6 flex items-center space-x-6 border-t pt-4">
              <div className="text-center">
                  <p className="font-bold text-xl">{userPosts.length}</p>
                  <p className="text-sm text-muted-foreground">Posts</p>
              </div>
               <div className="text-center">
                  <p className="font-bold text-xl">{totalLikes}</p>
                  <p className="text-sm text-muted-foreground">Likes</p>
              </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-6">
        <h2 className="font-headline text-2xl font-bold mb-6">Published Posts</h2>
        <PostList posts={userPosts} users={allUsers} emptyStateMessage="This user hasn't published any posts yet." />
      </div>
    </div>
  );
}
