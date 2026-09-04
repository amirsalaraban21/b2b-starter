import { defineRouteConfig } from "@medusajs/admin-sdk";
import { CreditCard } from "@medusajs/icons";
import {
  Badge,
  Button,
  Container,
  Heading,
  Input,
  Select,
  StatusBadge,
  Table,
  Text,
} from "@medusajs/ui";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { sdk } from "../../lib/client";
import { ManualPaymentStatusBadge } from "./status-badge";
import type { ManualPayment, ManualPaymentStatus } from "./types";

const PAGE_SIZE = 20;
const statuses: ManualPaymentStatus[] = [
  "awaiting_payment",
  "receipt_submitted",
  "under_review",
  "approved",
  "rejected",
];

const ManualPaymentsPage = () => {
  const [items, setItems] = useState<ManualPayment[]>([]);
  const [count, setCount] = useState(0);
  const [offset, setOffset] = useState(0);
  const [status, setStatus] = useState("all");
  const [orderId, setOrderId] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    const query = new URLSearchParams({
      limit: String(PAGE_SIZE),
      offset: String(offset),
    });
    if (status !== "all") query.set("status", status);
    if (orderId.trim()) query.set("order_id", orderId.trim());
    if (customerId.trim()) query.set("customer_id", customerId.trim());
    try {
      const result = await sdk.client.fetch<{
        manual_payments: ManualPayment[];
        count: number;
      }>(`/admin/manual-payments?${query}`, { method: "GET" });
      setItems(result.manual_payments);
      setCount(result.count);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Could not load manual payments."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [offset, status]);
  const applyFilters = () => {
    setOffset(0);
    void load();
  };

  return (
    <Container className="overflow-hidden p-0">
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div>
          <Heading>Manual Payments</Heading>
          <Text size="small" className="text-ui-fg-subtle">
            پرداخت‌های دستی
          </Text>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-2 border-b p-4 md:grid-cols-[180px_1fr_1fr_auto]">
        <Select value={status} onValueChange={setStatus}>
          <Select.Trigger>
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="all">All statuses</Select.Item>
            {statuses.map((value) => (
              <Select.Item key={value} value={value}>
                {value.replaceAll("_", " ")}
              </Select.Item>
            ))}
          </Select.Content>
        </Select>
        <Input
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="Order ID"
          aria-label="Filter by order ID"
        />
        <Input
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          placeholder="Customer ID"
          aria-label="Filter by customer ID"
        />
        <Button variant="secondary" onClick={applyFilters}>
          Apply
        </Button>
      </div>
      {error && <Text className="p-4 text-ui-fg-error">{error}</Text>}
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Order</Table.HeaderCell>
            <Table.HeaderCell>Customer</Table.HeaderCell>
            <Table.HeaderCell>Amount</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Receipt</Table.HeaderCell>
            <Table.HeaderCell>Payer / Reference</Table.HeaderCell>
            <Table.HeaderCell>Updated</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {loading ? (
            <Table.Row>
              <Table.Cell>Loading…</Table.Cell>
            </Table.Row>
          ) : items.length ? (
            items.map((item) => (
              <Table.Row key={item.id}>
                <Table.Cell>
                  <Link
                    className="text-ui-fg-interactive hover:underline"
                    to={`/manual-payments/${item.id}`}
                  >
                    {item.order_id}
                  </Link>
                </Table.Cell>
                <Table.Cell>{item.customer_id}</Table.Cell>
                <Table.Cell>
                  {new Intl.NumberFormat("en-US").format(item.amount)}{" "}
                  {item.currency_code.toUpperCase()}
                </Table.Cell>
                <Table.Cell>
                  <ManualPaymentStatusBadge status={item.status} />
                </Table.Cell>
                <Table.Cell>
                  {item.receipt_exists ? (
                    <StatusBadge color="green">Submitted</StatusBadge>
                  ) : (
                    <Badge color="grey">None</Badge>
                  )}
                </Table.Cell>
                <Table.Cell>
                  {item.payer_name || "—"}
                  <br />
                  <span className="text-ui-fg-subtle">
                    {item.payment_reference || "—"}
                  </span>
                </Table.Cell>
                <Table.Cell>
                  {new Date(item.updated_at).toLocaleString()}
                </Table.Cell>
              </Table.Row>
            ))
          ) : (
            <Table.Row>
              <Table.Cell>No manual payments found.</Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
      <div className="flex items-center justify-between border-t px-4 py-3">
        <Text size="small">
          {count
            ? `${offset + 1}–${Math.min(offset + PAGE_SIZE, count)} of ${count}`
            : "0 results"}
        </Text>
        <div className="flex gap-2">
          <Button
            size="small"
            variant="secondary"
            disabled={!offset || loading}
            onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}
          >
            Previous
          </Button>
          <Button
            size="small"
            variant="secondary"
            disabled={offset + PAGE_SIZE >= count || loading}
            onClick={() => setOffset(offset + PAGE_SIZE)}
          >
            Next
          </Button>
        </div>
      </div>
    </Container>
  );
};

export const config = defineRouteConfig({
  label: "Manual Payments",
  icon: CreditCard,
});
export default ManualPaymentsPage;
