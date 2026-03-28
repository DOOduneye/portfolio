import { Link } from "@tanstack/react-router";

export function SiteHeader() {
  return (
    <header className="flex items-center justify-between">
      <Link to="/" className="text-lg font-semibold text-text-primary">
        David Oduneye
      </Link>
      <nav className="flex gap-6 text-sm text-text-secondary">
        <Link
          to="/writing"
          className="transition-colors hover:text-text-primary"
          activeProps={{ className: "text-text-primary" }}
        >
          Writing
        </Link>
        <Link
          to="/about"
          className="transition-colors hover:text-text-primary"
          activeProps={{ className: "text-text-primary" }}
        >
          About
        </Link>
      </nav>
    </header>
  );
}
