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
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getTagSuggestions, getContentSuggestions } from "@/app/actions";
import type { SuggestContentOutput } from "@/ai/flows/suggest-content";
import { Lightbulb, Loader2, WandSparkles, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

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
  const [isSuggestingTags, setIsSuggestingTags] = useState(false);

  const [topicInput, setTopicInput] = useState("");
  const [isSuggestingContent, setIsSuggestingContent] = useState(false);
  const [contentSuggestions, setContentSuggestions] = useState<SuggestContentOutput['suggestions']>([]);


  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
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
    setIsSuggestingTags(true);
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
      setIsSuggestingTags(false);
    }
  };

  const addSuggestedTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    setSuggestedTags(suggestedTags.filter(s => s !== tag));
  };

  const handleSuggestContent = async () => {
    if (!topicInput.trim()) {
        toast({
            title: "Topic required",
            description: "Please enter a topic to get suggestions.",
            variant: "destructive",
        });
        return;
    }
    setIsSuggestingContent(true);
    setContentSuggestions([]);
    try {
        const { suggestions } = await getContentSuggestions({ topic: topicInput });
        setContentSuggestions(suggestions);
    } catch (error) {
        toast({
            title: "Error",
            description: "Could not fetch content suggestions.",
            variant: "destructive",
        });
    } finally {
        setIsSuggestingContent(false);
    }
  };

  const useSuggestion = (suggestion: {title: string, description: string}) => {
    setValue("title", suggestion.title, { shouldValidate: true });
    setValue("content", suggestion.description, { shouldValidate: true });
    setContentSuggestions([]);
    setTopicInput("");
    toast({
      title: "Content Applied!",
      description: "The suggestion has been added to the editor.",
    })
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
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
        </div>
        <div className="lg:col-span-1 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <WandSparkles className="text-accent" />
                        AI Content Ideas
                    </CardTitle>
                    <CardDescription>
                        Stuck? Enter a topic to get some blog post ideas.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="topic">Topic</Label>
                        <Input id="topic" value={topicInput} onChange={(e) => setTopicInput(e.target.value)} placeholder="e.g. 'React Hooks'" />
                    </div>
                     <Button type="button" variant="default" onClick={handleSuggestContent} disabled={isSuggestingContent} className="w-full">
                        {isSuggestingContent ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <WandSparkles className="mr-2 h-4 w-4" />
                        )}
                        Generate Ideas
                    </Button>
                </CardContent>
                {contentSuggestions.length > 0 && (
                    <CardContent className="space-y-4 border-t pt-6">
                        <h4 className="font-semibold text-sm">Suggestions:</h4>
                        <div className="space-y-4">
                            {contentSuggestions.map((suggestion, index) => (
                                <div key={index} className="p-3 bg-muted/50 rounded-lg text-sm">
                                    <p className="font-semibold mb-1">{suggestion.title}</p>
                                    <p className="text-muted-foreground mb-3 text-xs">{suggestion.description}</p>
                                    <Button size="sm" variant="outline" className="w-full" onClick={() => useSuggestion(suggestion)}>Use this idea</Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                )}
            </Card>

            <Card>
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <Lightbulb className="text-accent" />
                        AI Tag Suggestions
                    </CardTitle>
                    <CardDescription>
                        Generate relevant tags based on your post content.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button type="button" variant="outline" className="w-full" onClick={handleSuggestTags} disabled={isSuggestingTags}>
                        {isSuggestingTags ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Lightbulb className="mr-2 h-4 w-4" />
                        )}
                        Suggest Tags
                    </Button>
                </CardContent>
                {suggestedTags.length > 0 && (
                    <CardContent className="space-y-4 border-t pt-6">
                        <h4 className="font-semibold text-sm">Suggested Tags:</h4>
                        <div className="flex flex-wrap gap-2">
                        {suggestedTags.map((tag) => (
                            <Badge key={tag} variant="default" className="cursor-pointer" onClick={() => addSuggestedTag(tag)}>
                            + {tag}
                            </Badge>
                        ))}
                        </div>
                    </CardContent>
                )}
            </Card>
        </div>
      </div>
    </form>
  );
}
