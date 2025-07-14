import { PostForm } from "@/components/blog/post-form";

export default function NewPostPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
      <header className="mb-8">
        <h1 className="font-headline text-4xl font-bold">Create a New Post</h1>
        <p className="text-muted-foreground mt-2">
          Let your creativity flow. Fill out the form below to publish your
          next masterpiece.
        </p>
      </header>
      <PostForm />
    </div>
  );
}
