import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { Badge, Container, Heading, StatusBadge, Text } from "@medusajs/ui";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { sdk } from "../lib/client";
import type { ManualPayment } from "../routes/manual-payments/types";
import { ManualPaymentStatusBadge } from "../routes/manual-payments/status-badge";

type OrderData = { id: string; payment_status?: string };

const ManualPaymentOrderWidget = ({ data }: { data: OrderData }) => {
  const [payment, setPayment] = useState<ManualPayment | null>(null);
  useEffect(() => {
    sdk.client
      .fetch<{ manual_payments: ManualPayment[] }>(
        `/admin/manual-payments?order_id=${encodeURIComponent(
          data.id
        )}&limit=1`,
        { method: "GET" }
      )
      .then((result) => setPayment(result.manual_payments[0] || null))
      .catch(() => setPayment(null));
  }, [data.id]);
  if (!payment) return null;
  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">EarMed Manual Payment</Heading>
        <ManualPaymentStatusBadge status={payment.status} />
      </div>
      <div className="grid grid-cols-2 gap-4 px-6 py-4">
        <div>
          <Text size="small" className="text-ui-fg-subtle">
            Medusa payment
          </Text>
          <StatusBadge
            color={data.payment_status === "captured" ? "green" : "grey"}
          >
            {data.payment_status || "Unknown"}
          </StatusBadge>
        </div>
        <div>
          <Text size="small" className="text-ui-fg-subtle">
            Receipt submitted
          </Text>
          <Badge color={payment.receipt_exists ? "green" : "grey"}>
            {payment.receipt_exists ? "Yes" : "No"}
          </Badge>
        </div>
        <div>
          <Text size="small" className="text-ui-fg-subtle">
            Payer / reference
          </Text>
          <Text size="small">
            {payment.payer_name || "—"} · {payment.payment_reference || "—"}
          </Text>
        </div>
        <div className="flex items-end">
          <Link
            className="text-ui-fg-interactive text-sm hover:underline"
            to={`/manual-payments/${payment.id}`}
          >
            Open manual payment
          </Link>
        </div>
      </div>
    </Container>
  );
};

export const config = defineWidgetConfig({
  zone: "order.details.after",
  id: "earmed-manual-payment-order",
});
export default ManualPaymentOrderWidget;
