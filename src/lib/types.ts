
export interface User {
  id: string;
  fuid: string; // Firebase UID
  name: string;
  username: string;
  avatarUrl: string;
  bio: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  category: string;
  tags: string[];
  imageUrl: string;
  createdAt: string; // ISO string
  likes: number;
  isBookmarked: boolean;
}
