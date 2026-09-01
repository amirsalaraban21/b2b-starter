import { z } from "@medusajs/framework/zod"

export const professionalTypes = ["doctor", "audiologist", "clinic", "medical_organization", "other"] as const
export const CreateProfessionalApplication = z.object({
  first_name: z.string().trim().min(1).max(100), last_name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(320), phone: z.string().trim().min(7).max(40),
  professional_type: z.enum(professionalTypes), organization_name: z.string().trim().max(200).optional(),
  professional_identifier: z.string().trim().max(200).optional(), city: z.string().trim().min(1).max(100), notes: z.string().trim().max(2000).optional(),
}).superRefine((value, context) => { if (["clinic", "medical_organization"].includes(value.professional_type) && !value.organization_name) context.addIssue({ code: z.ZodIssueCode.custom, path: ["organization_name"], message: "Organization name is required for organizations." }) }).strict()
export type CreateProfessionalApplicationType = z.infer<typeof CreateProfessionalApplication>
