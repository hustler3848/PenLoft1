"use server";

import { suggestTags, type SuggestTagsInput } from "@/ai/flows/suggest-tags";
import { suggestContent, type SuggestContentInput, type SuggestContentOutput } from "@/ai/flows/suggest-content";

export async function getTagSuggestions(
  input: SuggestTagsInput
): Promise<string[]> {
  try {
    const result = await suggestTags(input);
    return result.tags;
  } catch (error) {
    console.error("Error suggesting tags:", error);
    return [];
  }
}

export async function getContentSuggestions(
  input: SuggestContentInput
): Promise<SuggestContentOutput> {
    try {
        const result = await suggestContent(input);
        return result;
    } catch (error) {
        console.error("Error suggesting content:", error);
        return { suggestions: [] };
    }
}
