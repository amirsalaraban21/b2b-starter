import { redirect } from "next/navigation"
import { retrieveCustomer } from "@/lib/data/customer"
export default async function LoggedInRegister({ params }: { params: Promise<{ countryCode: string }> }) { if (await retrieveCustomer().catch(() => null)) redirect(`/${(await params).countryCode}/account`); return null }
