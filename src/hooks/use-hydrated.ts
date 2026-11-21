import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

// false while rendering on the server and during hydration, true afterwards
export const useHydrated = () =>
  useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
