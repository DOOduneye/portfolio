import { Link } from "@tanstack/react-router";

interface PostCardProps {
  slug: string;
  title: string;
  excerpt: string | null;
  publishedAt: string | null;
}

export function PostCard({ slug, title, excerpt, publishedAt }: PostCardProps) {
  return (
    <article>
      <Link to="/writing/$slug" params={{ slug }} className="group block">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-medium text-text-primary transition-colors group-hover:text-accent">
            {title}
          </h3>
          {publishedAt && (
            <time
              dateTime={publishedAt}
              className="shrink-0 text-sm text-text-muted"
            >
              {formatDate(publishedAt)}
            </time>
          )}
        </div>
        {excerpt && (
          <p className="mt-1 text-sm text-text-secondary">{excerpt}</p>
        )}
      </Link>
    </article>
  );
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
