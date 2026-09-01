import { z } from "@medusajs/framework/zod"

export const UpdateProfessionalApplication = z.object({ status: z.enum(["approved", "rejected", "needs_information"]), admin_notes: z.string().trim().max(2000).optional() }).strict()
export type UpdateProfessionalApplicationType = z.infer<typeof UpdateProfessionalApplication>
