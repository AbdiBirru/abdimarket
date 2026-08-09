"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitReview } from "@/lib/actions/reviews";

type Props = {
  productId: string;
  existingReview: { rating: number; comment: string } | null;
};

export default function ReviewForm({ productId, existingReview }: Props) {
  const router = useRouter();
  const [rating, setRating] = useState(existingReview?.rating ?? 0);
  const [comment, setComment] = useState(existingReview?.comment ?? "");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const result = await submitReview(productId, rating, comment);

    setIsSubmitting(false);

    if ("error" in result) {
      setError(result.error);
      return;
    }

    setSubmitted(true);
    router.refresh();
  }

  if (submitted) {
    return (
      <p className="text-sm text-success-600">
        Thanks — your review has been {existingReview ? "updated" : "posted"}.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-line bg-surface p-4">
      <p className="text-sm font-medium text-ink">
        {existingReview ? "Edit your review" : "Write a review"}
      </p>
      <div className="mt-2 flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className={`text-2xl ${star <= rating ? "text-accent" : "text-line"}`}
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
          >
            ★
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="What did you think?"
        rows={3}
        className="mt-3 w-full rounded-2xl border border-line bg-surface px-4 py-2 text-sm text-ink focus:border-brand focus:outline-none"
      />
      {error && <p className="mt-2 text-xs text-error">{error}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-3 rounded-full bg-brand px-5 py-2 text-sm font-medium text-on-brand hover:bg-brand-hover disabled:opacity-50"
      >
        {isSubmitting ? "Submitting..." : existingReview ? "Update Review" : "Submit Review"}
      </button>
    </form>
  );
}
