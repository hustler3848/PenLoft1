import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BlogCard } from "@/components/blog/blog-card";
import { getPosts, getUsers } from "@/lib/data";

const categories = ["Technology", "Lifestyle", "Business", "Creative", "Code"];

export default function Home() {
  const posts = getPosts();
  const users = getUsers();

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <section className="text-center py-16 md:py-24">
        <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tighter mb-4">
          Where Great Ideas Take Flight
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          PenLoft is a modern, open space for writers to share their stories and
          for readers to discover captivating content.
        </p>
        <Link href="/posts/new">
          <Button size="lg">Start Writing</Button>
        </Link>
      </section>

      <section className="py-12">
        <div className="flex items-center justify-center flex-wrap gap-2 mb-12">
          <Badge variant="secondary" className="text-base px-4 py-2">All</Badge>
          {categories.map((category) => (
            <Badge key={category} variant="outline" className="text-base px-4 py-2 cursor-pointer hover:bg-secondary">
              {category}
            </Badge>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => {
            const author = users.find((user) => user.id === post.authorId);
            return <BlogCard key={post.id} post={post} author={author} />;
          })}
        </div>
      </section>
    </div>
  );
}
