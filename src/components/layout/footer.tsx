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
            href="https://www.linkedin.com/in/dooduneye"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-text-secondary"
          >
            LinkedIn
          </a>
          <a
            href="https://open.spotify.com/user/317gsn3rqunkxocwuvf7njcj5luy"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-text-secondary"
          >
            Spotify
          </a>
        </div>
      </div>
    </footer>
  );
}
