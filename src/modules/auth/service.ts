/**
 * AuthService — thin abstraction so the UI doesn't import Supabase directly
 * outside of the managed integration files. Works offline with a cached
 * session; enhances online via Supabase Auth.
 */

import { supabase } from "@/integrations/supabase/client";

export interface AuthUser {
  id: string;
  email?: string;
}

export const AuthService = {
  async currentUser(): Promise<AuthUser | null> {
    try {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return null;
      return { id: data.user.id, email: data.user.email ?? undefined };
    } catch {
      return null;
    }
  },
  onChange(cb: (user: AuthUser | null) => void): () => void {
    const { data } = supabase.auth.onAuthStateChange((_e, session) => {
      cb(
        session?.user
          ? { id: session.user.id, email: session.user.email ?? undefined }
          : null,
      );
    });
    return () => data.subscription.unsubscribe();
  },
  signOut: () => supabase.auth.signOut(),
};
