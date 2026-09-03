import { redirect } from "next/navigation"

export default async function AccountEntry({ params }: { params: Promise<{ countryCode: string }> }) { redirect(`/${(await params).countryCode}/account/login`) }
