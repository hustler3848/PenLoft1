"use server";

import { suggestTags, type SuggestTagsInput } from "@/ai/flows/suggest-tags";

export async function getTagSuggestions(
  input: SuggestTagsInput
): Promise<string[]> {
  try {
    const result = await suggestTags(input);
    return result.tags;
  } catch (error) {
    console.error("Error suggesting tags:", error);
    // In case of an error, return an empty array or handle it as needed.
    return [];
  }
}
