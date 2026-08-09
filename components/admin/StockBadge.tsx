import { getStockStatus } from "@/lib/inventory";

const LABELS = {
  out: "Out of Stock",
  low: "Low Stock",
  ok: "In Stock",
};

const STYLES = {
  out: "bg-error-subtle text-error-600",
  low: "bg-warning-subtle text-warning-600",
  ok: "bg-success-subtle text-success-600",
};

export default function StockBadge({ stock }: { stock: number }) {
  const status = getStockStatus(stock);
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${STYLES[status]}`}>
      {LABELS[status]} ({stock})
    </span>
  );
}
