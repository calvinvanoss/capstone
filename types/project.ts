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
    children: z.string().transform((str) => {
      try {
        return docNodesSchema.parse(JSON.parse(str)); // Parse the stringified JSON and validate it
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.error('Validation errors:', error.errors);
        } else {
          console.error('Unexpected error:', error);
        }
        return [];
      }
    }),
    id: z.string(),
    description: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
  });

export type Project = z.infer<typeof projectSchema>;

export const documentSchema = z.object({
  projectId: z.string(),
  path: z.string(),
  content: z.string().nullable(),
}).nullable();

export type Document = z.infer<typeof documentSchema>;