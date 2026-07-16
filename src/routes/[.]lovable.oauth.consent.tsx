import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/Card";
import { MButton } from "@/components/MButton";
import { Symbol } from "@/components/IconButton";

// The Supabase JS `auth.oauth` namespace is beta; keep a small typed wrapper so
// TypeScript can see the three methods we need.
type AuthorizationDetails = {
  client?: { name?: string; redirect_uri?: string };
  scope?: string;
  redirect_url?: string;
  redirect_to?: string;
};
type OAuthResult<T> = { data: T | null; error: { message: string } | null };
type OAuthApi = {
  getAuthorizationDetails: (id: string) => Promise<OAuthResult<AuthorizationDetails>>;
  approveAuthorization: (
    id: string,
  ) => Promise<OAuthResult<{ redirect_url?: string; redirect_to?: string }>>;
  denyAuthorization: (
    id: string,
  ) => Promise<OAuthResult<{ redirect_url?: string; redirect_to?: string }>>;
};
const oauth = (supabase.auth as unknown as { oauth: OAuthApi }).oauth;

type Search = { authorization_id: string };

export const Route = createFileRoute("/.lovable/oauth/consent")({
  ssr: false,
  validateSearch: (s: Record<string, unknown>): Search => ({
    authorization_id: typeof s.authorization_id === "string" ? s.authorization_id : "",
  }),
  beforeLoad: async ({ search, location }) => {
    if (!search.authorization_id) throw new Error("Missing authorization_id");
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      const next = location.pathname + location.searchStr;
      throw redirect({ to: "/auth", search: { next } });
    }
  },
  loader: async ({ location }) => {
    const authorizationId = new URLSearchParams(location.search).get("authorization_id")!;
    const { data, error } = await oauth.getAuthorizationDetails(authorizationId);
    if (error) throw new Error(error.message);
    const immediate = data?.redirect_url ?? data?.redirect_to;
    if (immediate && !data?.client) throw redirect({ href: immediate });
    return data;
  },
  head: () => ({
    meta: [
      { title: "Authorize — K-Ai Storage Saver" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Consent,
  errorComponent: ({ error }) => (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-10">
      <Card className="max-w-sm text-center">
        <h1 className="text-[17px] font-medium text-on-surface">Authorization error</h1>
        <p className="mt-2 text-[13px] text-on-surface-variant">
          {String((error as Error)?.message ?? error)}
        </p>
      </Card>
    </main>
  ),
});

function Consent() {
  const details = Route.useLoaderData();
  const { authorization_id } = Route.useSearch();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clientName = details?.client?.name ?? "This app";

  async function decide(approve: boolean) {
    setBusy(true);
    setError(null);
    const { data, error } = approve
      ? await oauth.approveAuthorization(authorization_id)
      : await oauth.denyAuthorization(authorization_id);
    if (error) {
      setBusy(false);
      setError(error.message);
      return;
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      setError("No redirect returned by the authorization server.");
      return;
    }
    window.location.href = target;
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-10">
      <Card className="w-full max-w-md">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-container">
            <Symbol name="key" filled className="text-on-primary-container" size={28} />
          </div>
          <h1 className="text-[20px] font-medium text-on-surface">
            Connect {clientName} to your K-Ai account
          </h1>
          <p className="text-[13px] leading-relaxed text-on-surface-variant">
            {clientName} will be able to call K-Ai's enabled tools while you are signed
            in. This does not bypass K-Ai's permissions or backend policies.
          </p>
        </div>

        <div className="mt-5 rounded-2xl bg-surface-2 p-4">
          <p className="text-[11px] uppercase tracking-wider text-on-surface-variant">
            Requested access
          </p>
          <ul className="mt-2 space-y-1 text-[13px] text-on-surface">
            <li>• Share your basic profile</li>
            <li>• Share your email address</li>
            <li>• Call K-Ai MCP tools as you</li>
          </ul>
        </div>

        {error && (
          <p role="alert" className="mt-3 text-[12px] text-destructive">
            {error}
          </p>
        )}

        <div className="mt-5 grid grid-cols-2 gap-3">
          <MButton variant="outlined" full disabled={busy} onClick={() => decide(false)}>
            Cancel connection
          </MButton>
          <MButton full disabled={busy} onClick={() => decide(true)}>
            Approve
          </MButton>
        </div>
      </Card>
    </main>
  );
}

