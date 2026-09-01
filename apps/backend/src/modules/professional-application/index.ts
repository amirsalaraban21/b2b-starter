import { Module } from "@medusajs/framework/utils"
import ProfessionalApplicationModuleService from "./service"

export const PROFESSIONAL_APPLICATION_MODULE = "professionalApplication"
export default Module(PROFESSIONAL_APPLICATION_MODULE, { service: ProfessionalApplicationModuleService })
