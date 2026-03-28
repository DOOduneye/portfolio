export function SiteFooter() {
  return (
    <footer className="border-t border-border pt-8 text-sm text-text-muted">
      <div className="flex items-center justify-between">
        <span>&copy; {new Date().getFullYear()} David Oduneye</span>
        <div className="flex gap-4">
          <a
            href="https://github.com/DOOduneye"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-text-secondary"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/davidoduneye"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-text-secondary"
          >
            LinkedIn
          </a>
          <a
            href="mailto:david@oduneye.com"
            className="transition-colors hover:text-text-secondary"
          >
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
