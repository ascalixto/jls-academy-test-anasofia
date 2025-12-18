import { z } from "zod"

export const toolSchema = z.object({
  name: z
    .string()
    .min(2, "Tool name must be at least 2 characters"),

  category: z
    .string()
    .min(1, "Please select a category"),

  visibility: z
  .union([z.literal("public"), z.literal("internal")])
  .refine((val) => val === "public" || val === "internal", {
    message: "Please select visibility",
  }),


  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(160, "Description must be under 160 characters"),

  tags: z.string().optional(),
})

export type ToolFormValues = z.infer<typeof toolSchema>
