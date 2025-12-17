import { z } from "zod"

export const settingsSchema = z.object({
  displayName: z
    .string()
    .min(2, "Display name must be at least 2 characters")
    .max(40, "Display name must be under 40 characters"),

  role: z.string().min(1, "Select a role"),

  bio: z
    .string()
    .max(160, "Bio must be under 160 characters")
    .optional(),

  notifications: z.boolean().default(true),
})

export type SettingsFormValues = z.infer<typeof settingsSchema>
