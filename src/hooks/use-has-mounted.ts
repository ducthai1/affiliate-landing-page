"use client";

import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/** true sau khi hydrate xong (server = false). Không setState trong effect. */
export function useHasMounted(): boolean {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}
