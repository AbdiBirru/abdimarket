type Review = {
  id: string;
  rating: number;
  comment: string;
  createdAt: Date;
  user: { name: string };
};

export default function ReviewList({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return <p className="text-sm text-ink/60">No reviews yet — be the first.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {reviews.map((review) => (
        <div key={review.id} className="rounded-2xl border border-line bg-white p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-ink">{review.user.name}</p>
            <p className="text-gold">
              {"★".repeat(review.rating)}
              {"☆".repeat(5 - review.rating)}
            </p>
          </div>
          <p className="mt-2 text-sm text-ink/70">{review.comment}</p>
          <p className="mt-2 text-xs text-ink/40">
            {review.createdAt.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>
      ))}
    </div>
  );
}
