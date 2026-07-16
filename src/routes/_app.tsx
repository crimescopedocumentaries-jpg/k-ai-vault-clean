import { createFileRoute, Outlet } from "@tanstack/react-router";
import { BottomNav } from "@/components/BottomNav";

/** Pathless layout for the four main tabs — renders the bottom navigation. */
export const Route = createFileRoute("/_app")({
  component: AppShellLayout,
});

function AppShellLayout() {
  return (
    <>
      <main className="flex flex-1 flex-col pb-2">
        <Outlet />
      </main>
      <BottomNav />
    </>
  );
}
