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
    setIsLiked((prev) => !prev);
    setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsBookmarked((prev) => !prev);
  };

  return (
    <div className="flex items-center gap-4 text-muted-foreground">
      <Button
        variant="ghost"
        size={showLabels ? 'default' : 'icon'}
        className="flex items-center gap-2"
        onClick={handleLikeClick}
        aria-pressed={isLiked}
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
        className="flex items-center gap-2"
        onClick={handleBookmarkClick}
        aria-pressed={isBookmarked}
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
