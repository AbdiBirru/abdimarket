"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateStock } from "@/lib/actions/products";

export default function QuickStockEditor({
  productId,
  initialStock,
}: {
  productId: string;
  initialStock: number;
}) {
  const router = useRouter();
  const [value, setValue] = useState(initialStock.toString());
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleSave() {
    const stock = Number(value);
    if (Number.isNaN(stock) || stock < 0) {
      setError("Enter a valid number.");
      return;
    }
    setError("");
    startTransition(async () => {
      const result = await updateStock(productId, stock);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-16 rounded-full border border-line bg-white px-2 py-1 text-center text-sm text-ink focus:border-brand focus:outline-none"
      />
      <button
        onClick={handleSave}
        disabled={isPending || value === initialStock.toString()}
        className="text-xs font-medium text-brand hover:underline disabled:opacity-40"
      >
        {isPending ? "..." : "Save"}
      </button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
