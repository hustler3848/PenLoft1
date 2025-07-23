
"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getTagSuggestions, getContentSuggestions } from "@/app/actions";
import type { SuggestContentOutput } from "@/ai/flows/suggest-content";
import { Lightbulb, Loader2, WandSparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AiToolsModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

export function AiToolsModal({ isOpen, onOpenChange }: AiToolsModalProps) {
    const { toast } = useToast();
    const { watch, setValue } = useFormContext(); // Using context to interact with the form

    const [tags, setTags] = useState<string[]>([]);
    const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
    const [isSuggestingTags, setIsSuggestingTags] = useState(false);

    const [topicInput, setTopicInput] = useState("");
    const [isSuggestingContent, setIsSuggestingContent] = useState(false);
    const [contentSuggestions, setContentSuggestions] = useState<SuggestContentOutput['suggestions']>([]);
    
    const contentValue = watch("content");

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
            // Note: This adds to local state. You need a way to pass this back to the form
            // or manage tags within the main form's state.
            setTags(prev => [...prev, tag]);
             toast({
                title: "Tag Added",
                description: `The tag "${tag}" has been added.`
            });
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
        onOpenChange(false); // Close modal after applying suggestion
        toast({
            title: "Content Applied!",
            description: "The suggestion has been added to the editor.",
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <WandSparkles className="text-accent" />
                        AI Assistant
                    </DialogTitle>
                    <DialogDescription>
                        Use AI to generate content ideas and suggest relevant tags for your post.
                    </DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="content-ideas" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="content-ideas">
                            <WandSparkles className="mr-2 h-4 w-4" />
                            Content Ideas
                        </TabsTrigger>
                        <TabsTrigger value="tag-suggestions">
                            <Lightbulb className="mr-2 h-4 w-4" />
                            Tag Suggestions
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="content-ideas" className="py-4">
                       <div className="space-y-4">
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
                        </div>
                        {contentSuggestions.length > 0 && (
                            <div className="mt-6 space-y-4">
                                <h4 className="font-semibold text-sm">Suggestions:</h4>
                                <div className="space-y-4 max-h-[300px] overflow-y-auto p-1">
                                    {contentSuggestions.map((suggestion, index) => (
                                        <div key={index} className="p-3 bg-muted/50 rounded-lg text-sm">
                                            <p className="font-semibold mb-1">{suggestion.title}</p>
                                            <p className="text-muted-foreground mb-3 text-xs">{suggestion.description}</p>
                                            <Button size="sm" variant="outline" className="w-full" onClick={() => useSuggestion(suggestion)}>Use this idea</Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </TabsContent>
                    <TabsContent value="tag-suggestions" className="py-4">
                         <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Generate relevant tags based on your post content (min. 50 characters).
                            </p>
                            <Button type="button" variant="outline" className="w-full" onClick={handleSuggestTags} disabled={isSuggestingTags}>
                                {isSuggestingTags ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Lightbulb className="mr-2 h-4 w-4" />
                                )}
                                Suggest Tags
                            </Button>
                        </div>
                        {suggestedTags.length > 0 && (
                            <div className="mt-6 space-y-4">
                                <h4 className="font-semibold text-sm">Suggested Tags:</h4>
                                <div className="flex flex-wrap gap-2">
                                {suggestedTags.map((tag) => (
                                    <Badge key={tag} variant="default" className="cursor-pointer" onClick={() => addSuggestedTag(tag)}>
                                    + {tag}
                                    </Badge>
                                ))}
                                </div>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
