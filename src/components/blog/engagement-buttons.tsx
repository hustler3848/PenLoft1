
"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Heart, Bookmark } from "lucide-react";

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
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);

  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // In a real app, you'd update the like state in your database.
    // For this demo, we'll just toggle the state visually.
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // In a real app, you'd update the bookmark state in your database.
    // For this demo, we'll just toggle the state visually.
    setIsBookmarked(!isBookmarked);
  };

  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <Button
        variant="ghost"
        size={showLabels ? 'default' : 'sm'}
        className="gap-1.5"
        onClick={handleLikeClick}
        aria-pressed={isLiked}
        title="Like this post"
      >
        <Heart
          className={cn(
            "h-5 w-5 transition-colors",
            isLiked ? "text-destructive fill-destructive" : ""
          )}
        />
        <span className="text-sm font-medium">{likes}</span>
        {showLabels && <span className="hidden sm:inline">Likes</span>}
      </Button>
      <Button
        variant="ghost"
        size={showLabels ? 'default' : 'sm'}
        className="gap-1.5"
        onClick={handleBookmarkClick}
        aria-pressed={isBookmarked}
        title="Bookmark this post"
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
