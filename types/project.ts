import { z } from 'zod';

// Step 1: Define the base schema without recursion
const baseTabSchema = z.object({
  id: z.string(),
  name: z.string(),
  content: z.string(),
});

// Step 2: Define the recursive type manually
export type Doc = z.infer<typeof baseTabSchema> & {
  children?: Doc[];
};

// Step 3: Create the recursive schema using `z.ZodType`
const tabSchema: z.ZodType<Doc> = baseTabSchema.extend({
  children: z.lazy(() => tabSchema.array()).optional(),
});

// Step 4: Define the schema for the array of tabs
const tabsSchema = z.array(tabSchema);

export const projectSchema = z.object({
    name: z.string(),
    tabs: z.string().transform((str) => {
      try {
        return tabsSchema.parse(JSON.parse(str)); // Parse the stringified JSON and validate it
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