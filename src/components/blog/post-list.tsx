
import type { Post, User } from "@/lib/types";
import { BlogCard } from "@/components/blog/blog-card";

interface PostListProps {
    posts: Post[];
    users: User[];
    emptyStateMessage?: string;
}

export function PostList({ posts, users, emptyStateMessage = "No posts found." }: PostListProps) {
    if (posts.length === 0) {
        return <p>{emptyStateMessage}</p>;
    }
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => {
                const author = users.find((u) => u.id === post.authorId);
                return (
                    <BlogCard
                        key={post.id}
                        post={post}
                        author={author}
                        className="fade-in"
                    />
                )
            })}
        </div>
    )
}
