import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { getManualPaymentConfig } from "../../../../modules/manual-payment/config"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const locale = req.query.locale === "en" ? "en" : "fa"
  const config = getManualPaymentConfig(locale)

  if (!config.configured) {
    return res.json({ configured: false })
  }

  return res.json({
    configured: true,
    card_number: config.card_number,
    account_holder: config.account_holder,
    bank_name: config.bank_name,
    instructions: config.instructions,
  })
}
