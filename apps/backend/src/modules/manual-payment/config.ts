export function getManualPaymentConfig(locale: "fa" | "en" = "fa") {
  const card_number = process.env.MANUAL_PAYMENT_CARD_NUMBER?.trim() || null
  const account_holder = process.env.MANUAL_PAYMENT_ACCOUNT_HOLDER?.trim() || null
  const bank_name = process.env.MANUAL_PAYMENT_BANK_NAME?.trim() || null
  const instructions = process.env[locale === "fa" ? "MANUAL_PAYMENT_INSTRUCTIONS_FA" : "MANUAL_PAYMENT_INSTRUCTIONS_EN"]?.trim() || null
  return { configured: Boolean(card_number && account_holder), card_number, account_holder, bank_name, instructions }
}
