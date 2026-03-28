import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import { SiteHeader } from "~/components/layout/header";
import { SiteFooter } from "~/components/layout/footer";
import globalCss from "~/styles/global.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "David Oduneye" },
      {
        name: "description",
        content: "Software engineer. Building thoughtful software.",
      },
    ],
    links: [
      { rel: "stylesheet", href: globalCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen bg-bg-base text-text-primary">
        <div className="mx-auto max-w-2xl px-6 py-12">
          <SiteHeader />
          <main className="py-12">
            <Outlet />
          </main>
          <SiteFooter />
        </div>
        <Scripts />
      </body>
    </html>
  );
}
