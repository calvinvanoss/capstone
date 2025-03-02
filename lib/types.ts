import { z } from 'zod';

// type parsing for frontend

// base zod objects
const baseDocNodeSchema = z.object({
  slug: z.string(),
  name: z.string(),
});
const docNodeSchema: z.ZodType<DocNode> = baseDocNodeSchema.extend({
  children: z.lazy(() => docNodeSchema.array()).optional(),
});
const treeSchema = z.array(docNodeSchema);

// parsers
export const projectVersionSchema = z
  .object({
    projectName: z.string(),
    children: treeSchema,
    versionId: z.number(),
    versionCount: z.number(),
    parentVersionId: z.number().nullable(),
    projectId: z.number(),
    versionUserId: z.string().nullable(),
    currentVersionCount: z.number(),
  })
  .transform((data) => {
    const editable = !!data.versionUserId && data.versionCount === -1;
    return {
      ...data,
      editable,
    };
  });

// type definitions
export type DocNode = z.infer<typeof baseDocNodeSchema> & {
  children?: DocNode[];
};
export type Tree = z.infer<typeof treeSchema>;
export type ProjectVersion = z.infer<typeof projectVersionSchema>;
