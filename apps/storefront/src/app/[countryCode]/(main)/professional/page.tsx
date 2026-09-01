import ProfessionalApplicationForm from "@/modules/professional/components/application-form"
import { Metadata } from "next"

export const metadata: Metadata = { title: "Professional purchasing", description: "Professional purchasing information for doctors, audiologists and clinics." }

export default function ProfessionalPage() {
  return <div className="content-container py-10 small:py-16"><p className="text-sm font-semibold text-teal-700">EarMed Professional</p><h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight">Professional purchasing for hearing-care practices</h1><p className="mt-5 max-w-2xl leading-7 text-ui-fg-subtle">Use existing account, quote, company, employee and approval features for eligible organization purchasing. Professional access is reviewed through the existing backend workflows; this page does not grant access by itself.</p><ProfessionalApplicationForm /></div>
}
