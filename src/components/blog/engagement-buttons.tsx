
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Heart, Bookmark } from "lucide-react";
import { useAuth } from "../auth-provider";

interface EngagementButtonsProps {
  initialLikes: number;
  initialBookmarked: boolean;
  showLabels?: boolean;
}

export function EngagementButtons({
  initialLikes,
  initialBookmarked,
  showLabels = false,
}: EngagementButtonsProps) {
  const router = useRouter();
  const { user } = useAuth();
  
  // We keep the state for visual feedback, but the action will be a redirect.
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);

  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      router.push("/sign-in");
      return;
    }
    // In a real app, you'd update the like state in your database.
    // For this demo, we'll just toggle the state visually.
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      router.push("/sign-in");
      return;
    }
    // In a real app, you'd update the bookmark state in your database.
    // For this demo, we'll just toggle the state visually.
    setIsBookmarked(!isBookmarked);
  };

  return (
    <div className="flex items-center gap-4 text-muted-foreground">
      <Button
        variant="ghost"
        size={showLabels ? 'default' : 'icon'}
        onClick={handleLikeClick}
        aria-pressed={isLiked}
        title={user ? "Like this post" : "Sign in to like this post"}
      >
        <Heart
          className={cn(
            "h-5 w-5 transition-colors",
            isLiked ? "text-destructive fill-destructive" : ""
          )}
        />
        {showLabels && <span>{likes} Likes</span>}
        {!showLabels && <span className="text-sm font-medium">{likes}</span>}
      </Button>
      <Button
        variant="ghost"
        size={showLabels ? 'default' : 'icon'}
        onClick={handleBookmarkClick}
        aria-pressed={isBookmarked}
        title={user ? "Bookmark this post" : "Sign in to bookmark this post"}
      >
        <Bookmark
          className={cn(
            "h-5 w-5 transition-colors",
            isBookmarked ? "text-primary fill-primary" : ""
          )}
        />
        {showLabels && <span>{isBookmarked ? "Bookmarked" : "Bookmark"}</span>}
      </Button>
    </div>
  );
}
