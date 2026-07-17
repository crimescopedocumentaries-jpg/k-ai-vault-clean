/**
 * BrowserNotificationsProvider — uses the Notifications API when the user
 * has granted permission. Android provider will use Capacitor LocalNotifications
 * behind the same interface.
 */

import type { LocalNotification, NotificationsProvider } from "../service";

const scheduled = new Map<string, number>();

export const browserNotificationsProvider: NotificationsProvider = {
  async schedule(n: LocalNotification): Promise<void> {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    if (Notification.permission !== "granted") return;
    const delay = Math.max(0, n.at - Date.now());
    const handle = window.setTimeout(() => {
      try {
        new Notification(n.title, { body: n.body, tag: n.id });
      } catch {
        /* ignore */
      }
      scheduled.delete(n.id);
    }, delay);
    scheduled.set(n.id, handle);
  },
  async cancel(id: string): Promise<void> {
    const h = scheduled.get(id);
    if (h) {
      clearTimeout(h);
      scheduled.delete(id);
    }
  },
};
