import { StatusBadge } from "@medusajs/ui";
import type { ManualPaymentStatus } from "./types";

const labels: Record<ManualPaymentStatus, string> = {
  awaiting_payment: "Awaiting payment",
  receipt_submitted: "Receipt submitted",
  under_review: "Under review",
  approved: "Approved",
  rejected: "Rejected",
};

const colors: Record<
  ManualPaymentStatus,
  "grey" | "blue" | "orange" | "green" | "red"
> = {
  awaiting_payment: "grey",
  receipt_submitted: "blue",
  under_review: "orange",
  approved: "green",
  rejected: "red",
};

export const ManualPaymentStatusBadge = ({
  status,
}: {
  status: ManualPaymentStatus;
}) => <StatusBadge color={colors[status]}>{labels[status]}</StatusBadge>;
