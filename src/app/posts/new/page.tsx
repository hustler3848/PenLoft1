
"use client";

import { useState } from "react";
import { PostForm } from "@/components/blog/post-form";
import { AiToolsModal } from "@/components/blog/ai-tools-modal";
import { Button } from "@/components/ui/button";
import { WandSparkles } from "lucide-react";

export default function NewPostPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
      <header className="mb-8 flex justify-between items-center">
        <div>
            <h1 className="font-headline text-4xl font-bold">Create a New Post</h1>
            <p className="text-muted-foreground mt-2">
            Let your creativity flow. Fill out the form below to publish your
            next masterpiece.
            </p>
        </div>
        <Button variant="outline" size="lg" onClick={() => setIsModalOpen(true)}>
            <WandSparkles className="mr-2 h-5 w-5 text-accent" />
            AI Tools
        </Button>
      </header>
      <PostForm>
        <AiToolsModal 
            isOpen={isModalOpen}
            onOpenChange={setIsModalOpen}
        />
      </PostForm>
    </div>
  );
}
