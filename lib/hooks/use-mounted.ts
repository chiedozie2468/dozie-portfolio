import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** Returns true only after the client has hydrated, avoiding SSR/client mismatches. */
export function useMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}
