import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { Container, Heading, StatusBadge, Text } from "@medusajs/ui";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { sdk } from "../lib/client";

type Application = {
  id: string;
  status: "pending" | "needs_information" | "approved" | "rejected";
  professional_type: string;
  organization_name?: string | null;
};
const colors = {
  pending: "orange",
  needs_information: "blue",
  approved: "green",
  rejected: "red",
} as const;

const ProfessionalApplicationCustomerWidget = ({
  data,
}: {
  data: { id: string };
}) => {
  const [application, setApplication] = useState<Application | null>(null);
  useEffect(() => {
    sdk.client
      .fetch<{ professional_applications: Application[] }>(
        `/admin/professional-applications?customer_id=${encodeURIComponent(
          data.id
        )}&limit=1`,
        { method: "GET" }
      )
      .then((result) =>
        setApplication(result.professional_applications[0] || null)
      )
      .catch(() => setApplication(null));
  }, [data.id]);
  if (!application) return null;
  return (
    <Container>
      <div className="flex items-center justify-between">
        <div>
          <Heading level="h2">Professional Application</Heading>
          <Text size="small" className="text-ui-fg-subtle">
            {application.professional_type}
            {application.organization_name
              ? ` · ${application.organization_name}`
              : ""}
          </Text>
        </div>
        <StatusBadge color={colors[application.status]}>
          {application.status.replaceAll("_", " ")}
        </StatusBadge>
      </div>
      <Link
        className="mt-4 inline-block text-ui-fg-interactive text-sm hover:underline"
        to={`/professional-applications/${application.id}`}
      >
        Open application
      </Link>
    </Container>
  );
};

export const config = defineWidgetConfig({
  zone: "customer.details.after",
  id: "earmed-professional-application-customer",
});
export default ProfessionalApplicationCustomerWidget;
