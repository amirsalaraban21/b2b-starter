import { MedusaService } from "@medusajs/framework/utils"
import { ManualPayment } from "./models"
import { assertManualPaymentTransition, ManualPaymentStatus } from "./transitions"

class ManualPaymentModuleService extends MedusaService({ ManualPayment }) {
  async transition(id: string, status: ManualPaymentStatus, data: Record<string, unknown> = {}) {
    const payment = await this.retrieveManualPayment(id)
    assertManualPaymentTransition(payment.status as ManualPaymentStatus, status)
    return this.updateManualPayments({ id, status, ...data })
  }
}
export default ManualPaymentModuleService
