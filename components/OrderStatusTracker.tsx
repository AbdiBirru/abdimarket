const STEPS = ["PENDING", "PAID", "SHIPPED", "DELIVERED"];

const STEP_LABELS: Record<string, string> = {
  PENDING: "Placed",
  PAID: "Paid",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
};

export default function OrderStatusTracker({ status }: { status: string }) {
  if (status === "CANCELLED") {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-center text-sm font-medium text-red-700">
        This order was cancelled.
      </div>
    );
  }

  const currentIndex = STEPS.indexOf(status);

  return (
    <div className="flex items-center">
      {STEPS.map((step, index) => {
        const isComplete = index <= currentIndex;
        const isLast = index === STEPS.length - 1;

        return (
          <div key={step} className="flex flex-1 items-center">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                  isComplete ? "bg-brand text-paper" : "bg-line text-ink/40"
                }`}
              >
                {isComplete ? "✓" : index + 1}
              </div>
              <p
                className={`mt-2 text-center text-[11px] leading-tight ${
                  isComplete ? "text-ink" : "text-ink/40"
                }`}
              >
                {STEP_LABELS[step]}
              </p>
            </div>
            {!isLast && (
              <div
                className={`mx-1 h-0.5 flex-1 ${
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
