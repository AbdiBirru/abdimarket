"use client";

import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";

export default function Pagination({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  if (totalPages <= 1) return null;

  function buildUrl(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    return `${pathname}?${params.toString()}`;
  }

  return (
    <div className="mt-10 flex items-center justify-center gap-4">
      <Link
        href={buildUrl(currentPage - 1)}
        aria-disabled={currentPage <= 1}
        className={`rounded-full border border-line px-4 py-2 text-sm font-medium ${
          currentPage <= 1
            ? "pointer-events-none opacity-40"
            : "text-ink hover:border-brand hover:text-brand"
        }`}
      >
        Previous
      </Link>
      <span className="text-sm text-ink/60">
        Page {currentPage} of {totalPages}
      </span>
      <Link
        href={buildUrl(currentPage + 1)}
        aria-disabled={currentPage >= totalPages}
        className={`rounded-full border border-line px-4 py-2 text-sm font-medium ${
          currentPage >= totalPages
            ? "pointer-events-none opacity-40"
            : "text-ink hover:border-brand hover:text-brand"
        }`}
      >
        Next
      </Link>
    </div>
  );
}
