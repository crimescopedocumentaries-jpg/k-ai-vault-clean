import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { MButton } from "@/components/MButton";
import { Card } from "@/components/Card";
import { Symbol } from "@/components/IconButton";

type Search = { next?: string };

export const Route = createFileRoute("/auth")({
  ssr: false,
  validateSearch: (s: Record<string, unknown>): Search => ({
    next: typeof s.next === "string" ? s.next : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Sign in — K-Ai Storage Saver" },
      { name: "description", content: "Sign in to K-Ai Storage Saver." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Auth,
});

function safeNext(raw: string | undefined): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "/home";
  return raw;
}

function Auth() {
  const _navigate = useNavigate();
  const { next } = Route.useSearch();
  const target = safeNext(next);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      if (data.session) window.location.href = target;
    });
    return () => {
      cancelled = true;
    };
  }, [target]);

  async function onGoogle() {
    setError(null);
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: `${window.location.origin}/auth${next ? `?next=${encodeURIComponent(next)}` : ""}`,
    });
    setBusy(false);
    if (result.error) {
      setError(result.error.message ?? "Google sign-in failed");
      return;
    }
    if (result.redirected) return;
    window.location.href = target;
  }

  async function onEmail(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setBusy(true);
    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) return setError(error.message);
      window.location.href = target;
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth${next ? `?next=${encodeURIComponent(next)}` : ""}`,
        },
      });
      setBusy(false);
      if (error) return setError(error.message);
      setNotice("Check your email to confirm your account, then sign in.");
    }
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-container">
            <Symbol name="hard_drive_2" filled className="text-on-primary-container" size={28} />
          </div>
          <h1 className="text-[22px] font-medium text-on-surface">Sign in to K-Ai</h1>
          <p className="text-[13px] text-on-surface-variant">
            Access your storage dashboard and Safe Vault.
          </p>
        </div>

        <Card>
          <MButton full onClick={onGoogle} disabled={busy} leading={<Symbol name="login" size={20} />}>
            Continue with Google
          </MButton>

          <div className="my-4 flex items-center gap-3 text-[11px] uppercase tracking-wider text-on-surface-variant">
            <span className="h-px flex-1 bg-border" />
            or
            <span className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={onEmail} className="flex flex-col gap-3">
            <label className="text-[12px] font-medium text-on-surface-variant" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 rounded-2xl bg-surface-2 px-4 text-[14px] text-on-surface outline-none focus:ring-2 focus:ring-primary"
            />
            <label className="text-[12px] font-medium text-on-surface-variant" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 rounded-2xl bg-surface-2 px-4 text-[14px] text-on-surface outline-none focus:ring-2 focus:ring-primary"
            />
            {error && (
              <p role="alert" className="text-[12px] text-destructive">
                {error}
              </p>
            )}
            {notice && <p className="text-[12px] text-tertiary">{notice}</p>}
            <MButton type="submit" full disabled={busy}>
              {mode === "signin" ? "Sign in" : "Create account"}
            </MButton>
          </form>

          <button
            type="button"
            onClick={() => {
              setError(null);
              setNotice(null);
              setMode(mode === "signin" ? "signup" : "signin");
            }}
            className="ripple mt-3 w-full rounded-full py-2 text-center text-[13px] font-medium text-primary"
          >
            {mode === "signin"
              ? "New here? Create an account"
              : "Have an account? Sign in"}
          </button>
        </Card>
      </div>
    </main>
  );
}

