/**
 * Connectivity — single source of truth for online/offline state.
 * The UI must not check `navigator.onLine` directly; it subscribes here.
 */

export type ConnectivityState = "online" | "offline";
export type ConnectivityListener = (state: ConnectivityState) => void;

class ConnectivityService {
  private listeners = new Set<ConnectivityListener>();
  private _state: ConnectivityState =
    typeof navigator !== "undefined" && navigator.onLine === false
      ? "offline"
      : "online";

  constructor() {
    if (typeof window === "undefined") return;
    window.addEventListener("online", () => this.set("online"));
    window.addEventListener("offline", () => this.set("offline"));
  }

  get state(): ConnectivityState {
    return this._state;
  }

  get isOnline(): boolean {
    return this._state === "online";
  }

  subscribe(fn: ConnectivityListener): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private set(next: ConnectivityState) {
    if (this._state === next) return;
    this._state = next;
    this.listeners.forEach((l) => l(next));
  }
}

export const connectivity = new ConnectivityService();
