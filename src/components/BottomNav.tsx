import { Link, useRouterState } from "@tanstack/react-router";
import { Symbol } from "./IconButton";

const items = [
  { to: "/home", label: "Home", icon: "home" },
  { to: "/vault", label: "Vault", icon: "shield" },
  { to: "/jobs", label: "Jobs", icon: "assignment" },
  { to: "/settings", label: "Settings", icon: "settings" },
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav
      aria-label="Primary"
      className="sticky bottom-0 z-20 mt-auto border-t border-border bg-surface/95 backdrop-blur-md"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto flex max-w-[440px] items-stretch justify-around px-2 pt-1.5 pb-2">
        {items.map((it) => {
          const active =
            pathname === it.to || (it.to !== "/home" && pathname.startsWith(it.to));
          return (
            <li key={it.to} className="flex-1">
              <Link
                to={it.to}
                className="ripple flex flex-col items-center gap-1 rounded-2xl py-1.5"
              >
                <span
                  className={
                    "flex h-8 w-16 items-center justify-center rounded-full transition-colors " +
                    (active ? "bg-primary-container" : "")
                  }
                >
                  <Symbol
                    name={it.icon}
                    filled={active}
                    className={active ? "text-on-primary-container" : "text-on-surface-variant"}
                    size={22}
                  />
                </span>
                <span
                  className={
                    "text-[11px] font-medium " +
                    (active ? "text-on-surface" : "text-on-surface-variant")
                  }
                >
                  {it.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
