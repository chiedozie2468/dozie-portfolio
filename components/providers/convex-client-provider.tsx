"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { useMemo, type ReactNode } from "react";

const DEFAULT_CONVEX_URL =
  "https://optimistic-bulldog-318.eu-west-1.convex.cloud";

export function getConvexUrl(): string {
  return process.env.NEXT_PUBLIC_CONVEX_URL || DEFAULT_CONVEX_URL;
}

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const client = useMemo(() => {
    return new ConvexReactClient(getConvexUrl());
  }, []);

  return <ConvexProvider client={client}>{children}</ConvexProvider>;
}
