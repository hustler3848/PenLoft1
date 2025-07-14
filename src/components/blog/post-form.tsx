"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getTagSuggestions } from "@/app/actions";
import { Lightbulb, Loader2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const postSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters long."),
  content: z.string().min(50, "Content must be at least 50 characters long."),
  category: z.string().nonempty("Please select a category."),
});

type PostFormData = z.infer<typeof postSchema>;

export function PostForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
  });
  
  const contentValue = watch("content");

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
  
  const handleSuggestTags = async () => {
    if (!contentValue || contentValue.length < 50) {
      toast({
        title: "Content too short",
        description: "Please write at least 50 characters before suggesting tags.",
        variant: "destructive",
      });
      return;
    }
    setIsSuggesting(true);
    setSuggestedTags([]);
    try {
      const suggestions = await getTagSuggestions({ blogContent: contentValue });
      setSuggestedTags(suggestions);
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not fetch tag suggestions.",
        variant: "destructive",
      });
    } finally {
      setIsSuggesting(false);
    }
  };

  const addSuggestedTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    setSuggestedTags(suggestedTags.filter(s => s !== tag));
  };

  const onSubmit = (data: PostFormData) => {
    console.log({ ...data, tags });
    toast({
      title: "Post Published!",
      description: "Your new blog post has been successfully published.",
    });
    router.push("/");
  };

  return (
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
          
          <div className="space-y-4">
            <Button type="button" variant="outline" onClick={handleSuggestTags} disabled={isSuggesting}>
              {isSuggesting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Lightbulb className="mr-2 h-4 w-4" />
              )}
              Suggest Tags with AI
            </Button>
            {suggestedTags.length > 0 && (
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-2 text-sm">Suggested Tags:</h4>
                <div className="flex flex-wrap gap-2">
                  {suggestedTags.map((tag) => (
                    <Badge key={tag} variant="default" className="cursor-pointer" onClick={() => addSuggestedTag(tag)}>
                      + {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
          
        </CardContent>
        <CardFooter className="p-6 border-t flex justify-end">
          <Button type="submit" size="lg">Publish Post</Button>
        </CardFooter>
      </Card>
    </form>
  );
}
