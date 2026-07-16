/**
 * App settings store — persisted to localStorage and applied globally.
 * Preview-only: mirrors what the native Android app will persist via DataStore.
 */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CompressionQuality } from "@/services";

export type ThemeMode = "system" | "dark" | "light";

export interface AppSettings {
  compressionQuality: CompressionQuality;
  keepOriginals: boolean;
  vaultEnabled: boolean;
  retentionDays: number;
  notifications: boolean;
  theme: ThemeMode;
}

const DEFAULTS: AppSettings = {
  compressionQuality: "balanced",
  keepOriginals: true,
  vaultEnabled: true,
  retentionDays: 30,
  notifications: true,
  theme: "dark",
};

const STORAGE_KEY = "kai.settings.v1";

type Ctx = {
  settings: AppSettings;
  update: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
  reset: () => void;
};

const SettingsContext = createContext<Ctx | null>(null);

function readStored(): AppSettings {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...(JSON.parse(raw) as Partial<AppSettings>) };
  } catch {
    return DEFAULTS;
  }
}

function applyTheme(theme: ThemeMode) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const prefersDark =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  const useDark = theme === "dark" || (theme === "system" && prefersDark);
  root.classList.toggle("dark", useDark);
  root.classList.toggle("light", !useDark);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", useDark ? "#232634" : "#f3f5f8");
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULTS);
  const [hydrated, setHydrated] = useState(false);

  // Read from storage after mount to avoid SSR mismatch.
  useEffect(() => {
    setSettings(readStored());
    setHydrated(true);
  }, []);

  // Persist + apply theme whenever settings change (post-hydration).
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      /* ignore */
    }
    applyTheme(settings.theme);
  }, [settings, hydrated]);

  // Re-apply on system theme change when following system.
  useEffect(() => {
    if (settings.theme !== "system" || typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = () => applyTheme("system");
    mq.addEventListener?.("change", listener);
    return () => mq.removeEventListener?.("change", listener);
  }, [settings.theme]);

  const value = useMemo<Ctx>(
    () => ({
      settings,
      update: (key, val) => setSettings((s) => ({ ...s, [key]: val })),
      reset: () => setSettings(DEFAULTS),
    }),
    [settings],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): Ctx {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
