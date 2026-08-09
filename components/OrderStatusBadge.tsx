const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-warning-subtle text-warning-600",
  PAID: "bg-success-subtle text-success-600",
  SHIPPED: "bg-info-subtle text-info-600",
  DELIVERED: "bg-success-subtle text-success-600",
  CANCELLED: "bg-error-subtle text-error-600",
};

export default function OrderStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
        STATUS_STYLES[status] ?? "bg-line text-ink-secondary"
      }`}
    >
      {status}
    </span>
  );
}
