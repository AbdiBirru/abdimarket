export default function RatingSummary({
  averageRating,
  count,
}: {
  averageRating: number | null;
  count: number;
}) {
  if (averageRating === null) {
    return <p className="text-sm text-ink/50">No ratings yet</p>;
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-gold">★</span>
      <span className="text-sm font-medium text-ink">{averageRating.toFixed(1)}</span>
      <span className="text-sm text-ink/50">
        ({count} review{count !== 1 ? "s" : ""})
      </span>
    </div>
  );
}
