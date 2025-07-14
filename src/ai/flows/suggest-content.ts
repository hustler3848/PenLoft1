// file: src/ai/flows/suggest-content.ts
'use server';

/**
 * @fileOverview Content suggestion AI agent for blog posts.
 *
 * - suggestContent - A function that suggests blog post ideas based on a topic.
 * - SuggestContentInput - The input type for the suggestContent function.
 * - SuggestContentOutput - The return type for the suggestContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestContentInputSchema = z.object({
  topic: z
    .string()
    .describe('The topic or keyword to generate blog content ideas from.'),
});
export type SuggestContentInput = z.infer<typeof SuggestContentInputSchema>;

const SuggestContentOutputSchema = z.object({
  suggestions: z
    .array(
      z.object({
        title: z.string().describe('The suggested title for the blog post.'),
        description: z
          .string()
          .describe('A brief description or starting point for the blog post content.'),
      })
    )
    .describe('An array of blog post content suggestions.'),
});
export type SuggestContentOutput = z.infer<typeof SuggestContentOutputSchema>;

export async function suggestContent(input: SuggestContentInput): Promise<SuggestContentOutput> {
  return suggestContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestContentPrompt',
  input: {schema: SuggestContentInputSchema},
  output: {schema: SuggestContentOutputSchema},
  prompt: `You are an expert blog content strategist.

  Given a topic or keyword, you will generate 3 distinct and engaging blog post ideas. Each idea should have a compelling title and a short description to serve as a starting point for the writer.

  Topic: {{{topic}}}

  Do not include any introductory or concluding remarks. The only thing that should be in the output is a JSON blob conforming to the output schema.
  `,
});

const suggestContentFlow = ai.defineFlow(
  {
    name: 'suggestContentFlow',
    inputSchema: SuggestContentInputSchema,
    outputSchema: SuggestContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
