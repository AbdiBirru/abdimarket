import { getStockStatus } from "@/lib/inventory";

const LABELS = {
  out: "Out of Stock",
  low: "Low Stock",
  ok: "In Stock",
};

const STYLES = {
  out: "bg-red-100 text-red-800",
  low: "bg-yellow-100 text-yellow-800",
  ok: "bg-green-100 text-green-800",
};

export default function StockBadge({ stock }: { stock: number }) {
  const status = getStockStatus(stock);
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${STYLES[status]}`}>
      {LABELS[status]} ({stock})
    </span>
  );
}
