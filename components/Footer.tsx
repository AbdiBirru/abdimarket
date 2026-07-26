export default function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-paper">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm">
        <p className="font-display text-lg text-brand">AbdiMarket</p>
        <p className="mt-1 text-ink/70">
          © {new Date().getFullYear()} AbdiMarket. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
