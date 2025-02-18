import { z } from "zod"

const baseTreeNodeSchema = z.object({
    name: z.string(),
    slug: z.string(),
    type: z.enum(['tab', 'folder', 'document']),
    content: z.string(), // s3 location
})

export type TreeNode = z.infer<typeof baseTreeNodeSchema> & {
    children: TreeNode[]
}

const TreeNodeSchema: z.ZodType<TreeNode> = z.object({
    name: z.string(),
    slug: z.string(),
    type: z.enum(['tab', 'folder', 'document']),
    content: z.string(), // s3 location
    children: z.lazy(() => TreeNodeSchema.array()),
})

export const projectSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    tabs: TreeNodeSchema.array(),
    updatedAt: z.string(),
    createdAt: z.string(),
})

export type Project = z.infer<typeof projectSchema>

export const projectListSchema = z.array(projectSchema)
