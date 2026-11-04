"use client";

import { useSyncExternalStore } from "react";
import {
  SERVER_SNAPSHOT,
  getStateSnapshot,
  subscribeState,
  type ProoflineState,
} from "@/lib/local";

/**
 * Proofline's localStorage state as an external store.
 * Server render always sees the empty state; the client
 * picks up the real one after hydration and on every write.
 */
export function useProoflineState(): ProoflineState {
  return useSyncExternalStore(subscribeState, getStateSnapshot, () => SERVER_SNAPSHOT);
}
