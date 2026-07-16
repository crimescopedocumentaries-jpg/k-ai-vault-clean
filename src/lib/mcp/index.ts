import { auth, defineMcp } from "@lovable.dev/mcp-js";
import echoTool from "./tools/echo";
import whoamiTool from "./tools/whoami";
import getStorageSnapshotTool from "./tools/get-storage-snapshot";

// The OAuth issuer MUST be the direct Supabase host. On publish, SUPABASE_URL
// is rewritten to a `.lovable.cloud` proxy, which mcp-js rejects (RFC 8414
// issuer mismatch). The project ref is the only Supabase value that survives
// publish unchanged. `import.meta.env.VITE_SUPABASE_PROJECT_ID` is inlined at
// build time; the fallback keeps the issuer well-formed during the
// throwaway manifest-extract eval, and a real token never verifies against it.
const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "k-ai-storage-saver-mcp",
  title: "K-Ai Storage Saver",
  version: "0.1.0",
  instructions:
    "Tools for K-Ai Storage Saver. Callers are authenticated K-Ai users via Supabase OAuth. Use `echo` to verify connectivity, `whoami` to confirm identity, and `get_storage_snapshot` to read the caller's current storage/vault snapshot.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [echoTool, whoamiTool, getStorageSnapshotTool],
});
