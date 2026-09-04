import { Badge, Button, Select, Table, Text } from "@medusajs/ui";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { sdk } from "../../lib/client";

type Application = {
  id: string;
  first_name: string;
  last_name: string;
  professional_type: string;
  organization_name?: string;
  email: string;
  city: string;
  customer_id?: string | null;
  status: string;
  created_at: string;
};
const PAGE_SIZE = 20;

const ProfessionalApplicationsTable = () => {
  const [items, setItems] = useState<Application[]>([]);
  const [status, setStatus] = useState("all");
  const [offset, setOffset] = useState(0);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const query = new URLSearchParams({
        limit: String(PAGE_SIZE),
        offset: String(offset),
      });
      if (status !== "all") query.set("status", status);
      const result = await sdk.client.fetch<{
        professional_applications: Application[];
        count: number;
      }>(`/admin/professional-applications?${query}`, { method: "GET" });
      setItems(result.professional_applications);
      setCount(result.count);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Could not load professional applications."
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    void load();
  }, [status, offset]);
  return (
    <div>
      <div className="flex items-center gap-2 border-b p-4">
        <Select
          value={status}
          onValueChange={(value) => {
            setStatus(value);
            setOffset(0);
          }}
        >
          <Select.Trigger className="w-52">
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="all">All statuses</Select.Item>
            {["pending", "needs_information", "approved", "rejected"].map(
              (value) => (
                <Select.Item key={value} value={value}>
                  {value.replaceAll("_", " ")}
                </Select.Item>
              )
            )}
          </Select.Content>
        </Select>
        <Button variant="secondary" onClick={() => void load()}>
          Refresh
        </Button>
      </div>
      {error && <Text className="p-4 text-ui-fg-error">{error}</Text>}
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Applicant</Table.HeaderCell>
            <Table.HeaderCell>Customer</Table.HeaderCell>
            <Table.HeaderCell>Type</Table.HeaderCell>
            <Table.HeaderCell>Organization</Table.HeaderCell>
            <Table.HeaderCell>Email</Table.HeaderCell>
            <Table.HeaderCell>City</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Submitted</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {loading ? (
            <Table.Row>
              <Table.Cell>Loading…</Table.Cell>
            </Table.Row>
          ) : items.length ? (
            items.map((app) => (
              <Table.Row key={app.id}>
                <Table.Cell>
                  <Link
                    className="text-ui-fg-interactive hover:underline"
                    to={`/professional-applications/${app.id}`}
                  >
                    {app.first_name} {app.last_name}
                  </Link>
                </Table.Cell>
                <Table.Cell>{app.customer_id || "—"}</Table.Cell>
                <Table.Cell>{app.professional_type}</Table.Cell>
                <Table.Cell>{app.organization_name || "—"}</Table.Cell>
                <Table.Cell>{app.email}</Table.Cell>
                <Table.Cell>{app.city}</Table.Cell>
                <Table.Cell>
                  <Badge>{app.status.replaceAll("_", " ")}</Badge>
                </Table.Cell>
                <Table.Cell>
                  {new Date(app.created_at).toLocaleDateString()}
                </Table.Cell>
              </Table.Row>
            ))
          ) : (
            <Table.Row>
              <Table.Cell>No applications found.</Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
      <div className="flex items-center justify-between border-t p-4">
        <Text size="small">
          {count
            ? `${offset + 1}–${Math.min(offset + PAGE_SIZE, count)} of ${count}`
            : "0 results"}
        </Text>
        <div className="flex gap-2">
          <Button
            size="small"
            variant="secondary"
            disabled={!offset}
            onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}
          >
            Previous
          </Button>
          <Button
            size="small"
            variant="secondary"
            disabled={offset + PAGE_SIZE >= count}
            onClick={() => setOffset(offset + PAGE_SIZE)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
export default ProfessionalApplicationsTable;
