import { defineRouteConfig } from "@medusajs/admin-sdk"
import { UserGroup } from "@medusajs/icons"
import { Container, Heading, Toaster } from "@medusajs/ui"
import ProfessionalApplicationsTable from "./professional-applications-table"

export const config = defineRouteConfig({ label: "Professional Applications", icon: UserGroup })
const ProfessionalApplications = () => <><Container className="flex flex-col overflow-hidden p-0"><Heading className="p-6 pb-0 font-sans font-medium h1-core">Professional Applications</Heading><ProfessionalApplicationsTable /></Container><Toaster /></>

export default ProfessionalApplications
