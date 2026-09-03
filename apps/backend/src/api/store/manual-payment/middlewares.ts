import { authenticate, MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { MiddlewareRoute } from "@medusajs/medusa"
import multer from "multer"

export const MANUAL_PAYMENT_RECEIPT_MAX_BYTES = 10 * 1024 * 1024

const allowedReceiptMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
])

const receiptUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MANUAL_PAYMENT_RECEIPT_MAX_BYTES, files: 1 },
  fileFilter: (_req, file, callback) => {
    if (!allowedReceiptMimeTypes.has(file.mimetype)) {
      return callback(new Error("Unsupported receipt file type."))
    }
    callback(null, true)
  },
})

const parseReceiptUpload = (
  req: MedusaRequest,
  res: MedusaResponse,
  next: (error?: unknown) => void
) => {
  receiptUpload.single("file")(req as any, res as any, (error: any) => {
    if (!error) return next()

    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        message: "Receipt files must be 10 MB or smaller.",
      })
    }

    return res.status(400).json({
      message: error.message || "Invalid receipt upload.",
    })
  })
}

export const storeManualPaymentMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET", "POST"],
    matcher: "/store/orders/:id/manual-payment",
    middlewares: [authenticate("customer", ["session", "bearer"])],
  },
  {
    method: ["POST"],
    matcher: "/store/orders/:id/manual-payment/receipt",
    middlewares: [
      authenticate("customer", ["session", "bearer"]),
      parseReceiptUpload,
    ],
  },
]
