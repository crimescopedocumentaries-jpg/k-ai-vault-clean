/**
 * NotificationsService.
 * Offline: locally scheduled notifications (via Capacitor LocalNotifications
 * on native; no-op on web preview).
 * Online: push notifications (future).
 */

export interface LocalNotification {
  id: string;
  title: string;
  body: string;
  at: number;
}

export interface NotificationsProvider {
  schedule(n: LocalNotification): Promise<void>;
  cancel(id: string): Promise<void>;
}

const defaultProvider: NotificationsProvider = {
  async schedule() {},
  async cancel() {},
};

let provider: NotificationsProvider = defaultProvider;

export const NotificationsService = {
  setProvider(p: NotificationsProvider) {
    provider = p;
  },
  schedule: (n: LocalNotification) => provider.schedule(n),
  cancel: (id: string) => provider.cancel(id),
};
