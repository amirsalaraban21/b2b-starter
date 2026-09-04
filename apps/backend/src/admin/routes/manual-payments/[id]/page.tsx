import {
  Button,
  Container,
  Heading,
  Input,
  Prompt,
  Text,
  toast,
} from "@medusajs/ui";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { sdk } from "../../../lib/client";
import { ManualPaymentStatusBadge } from "../status-badge";
import type { ManualPayment, ManualPaymentStatus } from "../types";

const DetailRow = ({
  label,
  value,
}: {
  label: string;
  value?: React.ReactNode;
}) => (
  <div className="grid grid-cols-[180px_1fr] gap-4 border-b py-3 last:border-0">
    <Text size="small" className="text-ui-fg-subtle">
      {label}
    </Text>
    <Text size="small">{value || "—"}</Text>
  </div>
);

const ManualPaymentDetail = () => {
  const { id } = useParams();
  const [payment, setPayment] = useState<ManualPayment | null>(null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [pendingStatus, setPendingStatus] =
    useState<ManualPaymentStatus | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const result = await sdk.client.fetch<{ manual_payment: ManualPayment }>(
        `/admin/manual-payments/${id}`,
        { method: "GET" }
      );
      setPayment(result.manual_payment);
      setNotes(result.manual_payment.admin_notes || "");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not load payment.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    void load();
  }, [id]);

  const updateStatus = async (status: ManualPaymentStatus) => {
    try {
      const result = await sdk.client.fetch<{ manual_payment: ManualPayment }>(
        `/admin/manual-payments/${id}/status`,
        { method: "POST", body: { status, admin_notes: notes } }
      );
      setPayment(result.manual_payment);
      setPendingStatus(null);
      toast.success("Manual payment updated.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Status update failed.");
    }
  };
  if (loading)
    return (
      <Container>
        <Text>Loading…</Text>
      </Container>
    );
  if (!payment)
    return (
      <Container>
        <Text>Manual payment not found.</Text>
      </Container>
    );
  const canReview = payment.status === "receipt_submitted";
  const canDecide =
    payment.status === "receipt_submitted" || payment.status === "under_review";

  return (
    <div className="flex flex-col gap-4">
      <Container className="p-0">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <Heading>Manual Payment</Heading>
            <Text size="small" className="text-ui-fg-subtle">
              {payment.id}
            </Text>
          </div>
          <ManualPaymentStatusBadge status={payment.status} />
        </div>
        <div className="px-6">
          <DetailRow
            label="Order"
            value={
              <Link
                className="text-ui-fg-interactive hover:underline"
                to={`/orders/${payment.order_id}`}
              >
                {payment.order_id}
              </Link>
            }
          />
          <DetailRow
            label="Customer"
            value={
              <Link
                className="text-ui-fg-interactive hover:underline"
                to={`/customers/${payment.customer_id}`}
              >
                {payment.customer_id}
              </Link>
            }
          />
          <DetailRow
            label="Amount"
            value={`${new Intl.NumberFormat("en-US").format(
              payment.amount
            )} ${payment.currency_code.toUpperCase()}`}
          />
          <DetailRow label="Payer name" value={payment.payer_name} />
          <DetailRow
            label="Payment reference"
            value={payment.payment_reference}
          />
          <DetailRow label="Reviewed by" value={payment.reviewed_by} />
          <DetailRow
            label="Reviewed at"
            value={
              payment.reviewed_at &&
              new Date(payment.reviewed_at).toLocaleString()
            }
          />
          <DetailRow
            label="Created"
            value={new Date(payment.created_at).toLocaleString()}
          />
          <DetailRow
            label="Updated"
            value={new Date(payment.updated_at).toLocaleString()}
          />
        </div>
      </Container>
      {payment.receipt_exists && (
        <Container>
          <Heading level="h2">Receipt</Heading>
          <div className="mt-4">
            {payment.receipt_mime_type?.startsWith("image/") ? (
              <img
                className="max-h-96 max-w-full rounded border object-contain"
                src={`/admin/manual-payments/${payment.id}/receipt`}
                alt="Submitted payment receipt"
              />
            ) : (
              <Button variant="secondary" asChild>
                <a
                  href={`/admin/manual-payments/${payment.id}/receipt`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open PDF receipt
                </a>
              </Button>
            )}
          </div>
        </Container>
      )}
      <Container>
        <Heading level="h2">Review</Heading>
        {canDecide ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {canReview && (
              <Button
                variant="secondary"
                onClick={() => setPendingStatus("under_review")}
              >
                Mark under review
              </Button>
            )}
            <Button onClick={() => setPendingStatus("approved")}>
              Approve payment
            </Button>
            <Button
              variant="danger"
              onClick={() => setPendingStatus("rejected")}
            >
              Reject receipt
            </Button>
          </div>
        ) : (
          <Text size="small" className="mt-4 text-ui-fg-subtle">
            No review action is available for this status.
          </Text>
        )}
      </Container>
      <Prompt
        open={Boolean(pendingStatus)}
        onOpenChange={(open) => !open && setPendingStatus(null)}
      >
        <Prompt.Content>
          <Prompt.Header>
            <Prompt.Title>Confirm manual payment review</Prompt.Title>
            <Prompt.Description>
              This action follows the server-authoritative transition rules.
              Approval does not capture the Medusa payment.
            </Prompt.Description>
          </Prompt.Header>
          <div className="px-6 py-4">
            <Text size="small" weight="plus">
              Admin notes
            </Text>
            <Input
              className="mt-2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={2000}
              placeholder={
                pendingStatus === "rejected"
                  ? "Reason for rejection"
                  : "Optional review notes"
              }
            />
          </div>
          <Prompt.Footer>
            <Button variant="secondary" onClick={() => setPendingStatus(null)}>
              Cancel
            </Button>
            <Button
              variant={pendingStatus === "rejected" ? "danger" : "primary"}
              onClick={() => pendingStatus && void updateStatus(pendingStatus)}
            >
              Confirm
            </Button>
          </Prompt.Footer>
        </Prompt.Content>
      </Prompt>
    </div>
  );
};

export default ManualPaymentDetail;
