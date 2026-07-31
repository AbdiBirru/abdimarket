const STAGES = [
  { key: "PENDING", label: "Pending" },
  { key: "PAID", label: "Paid" },
  { key: "SHIPPED", label: "Shipped" },
  { key: "DELIVERED", label: "Delivered" },
];

export default function OrderProgressTracker({ status }: { status: string }) {
  if (status === "CANCELLED") {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-center">
        <p className="font-medium text-red-800">This order was cancelled</p>
      </div>
    );
  }

  const currentIndex = STAGES.findIndex((s) => s.key === status);

  return (
    <div className="flex items-start">
      {STAGES.map((stage, index) => {
        const isComplete = index <= currentIndex;
        const isLast = index === STAGES.length - 1;
        return (
          <div key={stage.key} className="flex flex-1 items-start">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                  isComplete ? "bg-brand text-paper" : "bg-line text-ink/40"
                }`}
              >
                {isComplete ? "✓" : index + 1}
              </div>
              <span
                className={`mt-2 text-center text-[11px] leading-tight ${
                  isComplete ? "text-ink" : "text-ink/40"
                }`}
              >
                {stage.label}
              </span>
            </div>
            {!isLast && (
              <div
                className={`mx-1 mt-3.5 h-0.5 flex-1 ${
                  index < currentIndex ? "bg-brand" : "bg-line"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
