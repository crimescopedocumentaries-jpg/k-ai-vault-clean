import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SettingsProvider } from "../lib/settings";

function NotFoundComponent() {
  return (
    <div className="phone-frame flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-6xl font-light text-on-surface">404</h1>
        <p className="mt-2 text-on-surface-variant">This screen doesn’t exist.</p>
        <Link
          to="/home"
          className="ripple mt-6 inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="phone-frame flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-lg font-medium text-on-surface">Something interrupted this screen</h1>
        <p className="mt-2 text-sm text-on-surface-variant">
          Try again. Your files were not touched.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="ripple h-11 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground"
          >
            Try again
          </button>
          <Link
            to="/home"
            className="ripple inline-flex h-11 items-center rounded-full border border-border px-5 text-sm font-medium text-on-surface"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content:
          "width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no",
      },
      { name: "theme-color", content: "#232634" },
      { title: "K-Ai Storage Saver — Recover storage and protect memories" },
      {
        name: "description",
        content:
          "Recover storage safely on Android. Compress photos and videos while protected originals stay in the Safe Vault.",
      },
      { name: "author", content: "K-Ai" },
      { property: "og:site_name", content: "K-Ai Storage Saver" },
      { property: "og:title", content: "K-Ai Storage Saver — Recover storage and protect memories" },
      {
        property: "og:description",
        content:
          "Recover storage safely on Android. Compress photos and videos while protected originals stay in the Safe Vault.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "K-Ai Storage Saver — Recover storage and protect memories" },
      { name: "twitter:description", content: "Recover storage safely on Android. Compress photos and videos while protected originals stay in the Safe Vault." },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;600&family=Google+Sans+Text:wght@400;500;600&display=swap",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,300..600,0..1,-25..0&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              name: "K-Ai",
              url: "https://k-ai-vault-clean.lovable.app",
            },
            {
              "@type": "WebSite",
              name: "K-Ai Storage Saver",
              url: "https://k-ai-vault-clean.lovable.app",
              description:
                "Recover storage safely on Android. Compress photos and videos while protected originals stay in the Safe Vault.",
            },
          ],
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <div className="phone-frame flex flex-col">
          <Outlet />
        </div>
      </SettingsProvider>
    </QueryClientProvider>
  );
}
