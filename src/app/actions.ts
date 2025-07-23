
"use server";

import { suggestTags, type SuggestTagsInput } from "@/ai/flows/suggest-tags";
import { suggestContent, type SuggestContentOutput, type SuggestContentInput } from "@/ai/flows/suggest-content";

export async function getTagSuggestions(
  input: SuggestTagsInput
): Promise<string[]> {
  try {
    const result = await suggestTags(input);
    return result.tags;
  } catch (error) {
    console.error("Error suggesting tags:", error);
    // Re-throw the error to be caught by the client-side component
    throw new Error("Failed to suggest tags.");
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
        // Re-throw the error to be caught by the client-side component
        throw new Error("Failed to suggest content.");
    }
}
