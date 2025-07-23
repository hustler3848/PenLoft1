
"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";
import { createPost } from "@/lib/data";
import { useAuth } from "../auth-provider";

const postSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters long."),
  content: z.string().min(50, "Content must be at least 50 characters long."),
  category: z.string().nonempty("Please select a category."),
});

type PostFormData = z.infer<typeof postSchema>;

interface PostFormProps {
    children: ReactNode;
}

export function PostForm({ children }: PostFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth(); // We'll need the logged-in user's ID
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  
  const methods = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "",
    }
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = methods;

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };
  
  const onSubmit = (data: PostFormData) => {
    if (!user) {
        toast({
            title: "Authentication Error",
            description: "You must be signed in to create a post.",
            variant: "destructive"
        });
        return;
    }
    
    // Call the new function to add the post to our mock data
    createPost({ ...data, tags, authorId: user.uid });

    toast({
      title: "Post Published!",
      description: "Your new blog post has been successfully published.",
    });
    // Redirect to the homepage to see the new post
    router.push("/");
  };

  return (
    <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
            <CardContent className="p-6 grid gap-6">
            <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" {...register("title")} placeholder="Your amazing post title" />
                {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="content">Content (Markdown supported)</Label>
                <Textarea id="content" {...register("content")} placeholder="Write your heart out..." className="min-h-[300px]" />
                {errors.content && <p className="text-sm text-destructive">{errors.content.message}</p>}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="Technology">Technology</SelectItem>
                        <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                        <SelectItem value="Business">Business</SelectItem>
                        <SelectItem value="Creative">Creative</SelectItem>
                        <SelectItem value="Code">Code</SelectItem>
                        </SelectContent>
                    </Select>
                    )}
                />
                {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
                </div>
                
                <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <div className="flex flex-wrap items-center gap-2 p-2 border rounded-md min-h-[40px]">
                    {tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                        {tag}
                        <button type="button" onClick={() => handleRemoveTag(tag)} className="ml-1 rounded-full hover:bg-muted-foreground/20">
                        <X className="h-3 w-3" />
                        </button>
                    </Badge>
                    ))}
                    <Input
                    id="tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    className="flex-grow border-none focus-visible:ring-0 p-0 h-auto shadow-none"
                    placeholder="Add tags..."
                    />
                </div>
                </div>
            </div>
            </CardContent>
            <CardFooter className="p-6 border-t flex justify-end">
            <Button type="submit" size="lg">Publish Post</Button>
            </CardFooter>
        </Card>
        {children}
        </form>
    </FormProvider>
  );
}
