import { z } from 'zod';

// Step 1: Define the base schema without recursion
const baseDocSchema = z.object({
  id: z.string(),
  name: z.string(),
  content: z.string().optional(),
});

// Step 2: Define the recursive type manually
export type Doc = z.infer<typeof baseDocSchema> & {
  children?: Doc[];
};

// Step 3: Create the recursive schema using `z.ZodType`
const docSchema: z.ZodType<Doc> = baseDocSchema.extend({
  children: z.lazy(() => docSchema.array()).optional(),
});

// Step 4: Define the schema for the array of docs
const docsSchema = z.array(docSchema);

export const projectSchema = z.object({
    name: z.string(),
    children: z.string().transform((str) => {
      try {
        return docsSchema.parse(JSON.parse(str)); // Parse the stringified JSON and validate it
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.error('Validation errors:', error.errors);
        } else {
          console.error('Unexpected error:', error);
        }
        return [];
      }
    }),
    id: z.string().nullable(),
    description: z.string().nullable(),
    content: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
  });

export type Project = z.infer<typeof projectSchema>;

export const contentSchema = z.object({
  id: z.string(),
  content: z.string(),
}).nullable();

export type Content = z.infer<typeof contentSchema>;