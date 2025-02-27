import { YooptaContentValue } from '@yoopta/editor';
import { z } from 'zod';

// Step 1: Define the base schema without recursion
const baseDocNodeSchema = z.object({
  slug: z.string(),
  name: z.string(),
});

// Step 2: Define the recursive type manually
export type DocNode = z.infer<typeof baseDocNodeSchema> & {
  children?: DocNode[];
};

// Step 3: Create the recursive schema using `z.ZodType`
const docNodeSchema: z.ZodType<DocNode> = baseDocNodeSchema.extend({
  children: z.lazy(() => docNodeSchema.array()).optional(),
});

// Step 4: Define the schema for the array of docs
const docNodesSchema = z.array(docNodeSchema);

export const projectSchema = z.object({
    name: z.string(),
    children: docNodesSchema,
    id: z.number(),
    description: z.string().nullable(),
  });

export type Project = z.infer<typeof projectSchema>;

export const documentSchema = z.object({
  projectId: z.number(),
  path: z.string().nullable(),
  content: z.custom<YooptaContentValue>().nullable(),
});

export type Document = z.infer<typeof documentSchema>;