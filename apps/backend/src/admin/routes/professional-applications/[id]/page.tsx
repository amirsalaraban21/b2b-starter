import {
  Button,
  Container,
  Heading,
  Input,
  StatusBadge,
  Text,
  Textarea,
  toast,
} from "@medusajs/ui";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { sdk } from "../../../lib/client";

type Application = {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  professional_type: string;
  organization_name?: string | null;
  professional_identifier?: string | null;
  city: string;
  notes?: string | null;
  customer_feedback?: string | null;
  status: "pending" | "needs_information" | "approved" | "rejected";
  admin_notes?: string | null;
  customer_id?: string | null;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  created_at: string;
  updated_at: string;
};
const colors = {
  pending: "orange",
  needs_information: "blue",
  approved: "green",
  rejected: "red",
} as const;
const Row = ({ label, value }: { label: string; value?: React.ReactNode }) => (
  <div className="grid grid-cols-[190px_1fr] gap-4 border-b py-3 last:border-0">
    <Text size="small" className="text-ui-fg-subtle">
      {label}
    </Text>
    <Text size="small">{value || "—"}</Text>
  </div>
);

const ProfessionalApplicationDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState<Application | null>(null);
  const [notes, setNotes] = useState("");
  const [feedback, setFeedback] = useState("");
  const load = async () => {
    try {
      const r = await sdk.client.fetch<{
        professional_application: Application;
      }>(`/admin/professional-applications/${id}`, { method: "GET" });
      setItem(r.professional_application);
      setNotes(r.professional_application.admin_notes || "");
      setFeedback(r.professional_application.customer_feedback || "");
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Could not load application."
      );
    }
  };
  useEffect(() => {
    void load();
  }, [id]);
  const transition = async (status: Application["status"]) => {
    if (
      !window.confirm(
        `Change application status to ${status.replaceAll("_", " ")}?`
      )
    )
      return;
    try {
      const r = await sdk.client.fetch<{
        professional_application: Application;
      }>(`/admin/professional-applications/${id}`, {
        method: "POST",
        body: {
          status,
          admin_notes: notes,
          ...(status === "needs_information"
            ? { customer_feedback: feedback }
            : {}),
        },
      });
      setItem(r.professional_application);
      toast.success("Application updated.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Update failed.");
    }
  };
  if (!item)
    return (
      <Container>
        <Text>Loading…</Text>
      </Container>
    );
  const actions =
    item.status === "pending"
      ? (["needs_information", "approved", "rejected"] as const)
      : item.status === "needs_information"
      ? (["pending", "approved", "rejected"] as const)
      : [];
  return (
    <div className="flex flex-col gap-4">
      <Container className="p-0">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <Heading>
            {item.first_name} {item.last_name}
          </Heading>
          <StatusBadge color={colors[item.status]}>
            {item.status.replaceAll("_", " ")}
          </StatusBadge>
        </div>
        <div className="px-6">
          <Row
            label="Customer"
            value={
              item.customer_id && (
                <Link
                  className="text-ui-fg-interactive hover:underline"
                  to={`/customers/${item.customer_id}`}
                >
                  {item.customer_id}
                </Link>
              )
            }
          />
          <Row label="Email" value={item.email} />
          <Row label="Phone" value={item.phone} />
          <Row label="Professional type" value={item.professional_type} />
          <Row label="Organization" value={item.organization_name} />
          <Row
            label="Professional identifier"
            value={item.professional_identifier}
          />
          <Row label="City" value={item.city} />
          <Row label="Applicant notes" value={item.notes} />
          <Row label="Customer feedback" value={item.customer_feedback} />
          <Row label="Reviewed by" value={item.reviewed_by} />
          <Row
            label="Reviewed at"
            value={
              item.reviewed_at && new Date(item.reviewed_at).toLocaleString()
            }
          />
          <Row
            label="Created"
            value={new Date(item.created_at).toLocaleString()}
          />
          <Row
            label="Updated"
            value={new Date(item.updated_at).toLocaleString()}
          />
        </div>
      </Container>
      <Container>
        <Heading level="h2">Review</Heading>
        <div className="mt-4 grid gap-4">
          <label>
            <Text size="small" weight="plus">
              Admin notes
            </Text>
            <Textarea
              className="mt-2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={2000}
              disabled={!actions.length}
            />
          </label>
          {actions.includes("needs_information" as never) && (
            <label>
              <Text size="small" weight="plus">
                Feedback visible to customer
              </Text>
              <Input
                className="mt-2"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                maxLength={2000}
              />
            </label>
          )}
          <div className="flex flex-wrap gap-2">
            {actions.map((status) => (
              <Button
                key={status}
                variant={
                  status === "rejected"
                    ? "danger"
                    : status === "approved"
                    ? "primary"
                    : "secondary"
                }
                onClick={() => void transition(status)}
              >
                {status.replaceAll("_", " ")}
              </Button>
            ))}
            {!actions.length && (
              <Text size="small" className="text-ui-fg-subtle">
                This application is terminal and read-only.
              </Text>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};
export default ProfessionalApplicationDetail;
