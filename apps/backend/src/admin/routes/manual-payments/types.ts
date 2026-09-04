export type ManualPaymentStatus =
  | "awaiting_payment"
  | "receipt_submitted"
  | "under_review"
  | "approved"
  | "rejected";

export type ManualPayment = {
  id: string;
  order_id: string;
  customer_id: string;
  amount: number;
  currency_code: string;
  status: ManualPaymentStatus;
  receipt_exists: boolean;
  receipt_mime_type?: string | null;
  receipt_download_url?: string | null;
  payer_name?: string | null;
  payment_reference?: string | null;
  admin_notes?: string | null;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  created_at: string;
  updated_at: string;
};
