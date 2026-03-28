import { Effect } from "effect";
import { createHighlighter, type Highlighter } from "shiki";

let _highlighter: Highlighter | null = null;

async function getHighlighter(): Promise<Highlighter> {
  if (!_highlighter) {
    _highlighter = await createHighlighter({
      themes: ["github-dark"],
      langs: ["typescript", "javascript", "tsx", "bash", "json", "sql", "css", "html"],
    });
  }
  return _highlighter;
}

export function estimateReadingTime(content: string): number {
  const words = content.split(/\s+/).length;
  return Math.max(1, Math.round(words / 230));
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export const renderMarkdown = (source: string) =>
  Effect.tryPromise({
    try: async () => {
      const highlighter = await getHighlighter();
      let html = source;

      // Fenced code blocks
      const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
      const matches = [...html.matchAll(codeBlockRegex)];
      for (const match of matches) {
        const lang = match[1] || "text";
        const code = match[2].trimEnd();
        try {
          const highlighted = highlighter.codeToHtml(code, { lang, theme: "github-dark" });
          html = html.replace(match[0], highlighted);
        } catch {
          html = html.replace(match[0], `<pre><code class="language-${lang}">${escapeHtml(code)}</code></pre>`);
        }
      }

      // Inline code
      html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
      // Headers
      html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
      html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");
      html = html.replace(/^# (.+)$/gm, "<h1>$1</h1>");
      // Bold and italic
      html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
      html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
      // Links
      html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
      // Horizontal rules
      html = html.replace(/^---$/gm, "<hr />");
      // Unordered lists
      html = html.replace(/^- (.+)$/gm, "<li>$1</li>");
      html = html.replace(/(<li>[\s\S]*?<\/li>\n?)+/g, (m) => `<ul>${m}</ul>`);

      // Wrap remaining blocks in paragraphs
      html = html
        .split("\n\n")
        .map((block) => {
          const trimmed = block.trim();
          if (!trimmed) return "";
          if (/^<(h[1-6]|pre|ul|ol|hr|blockquote|div)/.test(trimmed)) return trimmed;
          return `<p>${trimmed.replace(/\n/g, "<br />")}</p>`;
        })
        .join("\n");

      return html;
    },
    catch: (error) => new ContentRenderError(String(error)),
  });

export class ContentRenderError {
  readonly _tag = "ContentRenderError";
  constructor(readonly message: string) {}
}
