"use client";

import { ConvexHttpClient } from "convex/browser";
import { useEffect, useState } from "react";

import { getConvexUrl } from "@/components/providers/convex-client-provider";
import { api } from "@/convex/_generated/api";
import {
  INITIAL_CAPABILITIES,
  INITIAL_PROJECTS,
  type CapabilityGroup,
  type PortfolioProject,
} from "@/lib/portfolio-data";

export type ConvexConnectionState =
  | "connecting"
  | "live"
  | "awaiting-initial-deploy";

export function usePortfolioData() {
  const [projects, setProjects] =
    useState<PortfolioProject[]>(INITIAL_PROJECTS);
  const [capabilities, setCapabilities] = useState<CapabilityGroup[]>(
    INITIAL_CAPABILITIES
  );
  const [connectionState, setConnectionState] =
    useState<ConvexConnectionState>("connecting");

  useEffect(() => {
    let cancelled = false;
    const client = new ConvexHttpClient(getConvexUrl());

    async function loadFromConvex() {
      try {
        const result = await client.query(api.portfolio.getPortfolioData, {});
        if (cancelled) return;

        if (result.projects && result.projects.length > 0) {
          setProjects(result.projects);
        }
        if (result.capabilities && result.capabilities.length > 0) {
          setCapabilities(result.capabilities);
        }
        setConnectionState("live");
      } catch {
        if (!cancelled) {
          // Remote Convex deployment is reachable at optimistic-bulldog-318
          // and awaiting initial function push (`npx convex dev`).
          setConnectionState("awaiting-initial-deploy");
        }
      }
    }

    loadFromConvex();
    return () => {
      cancelled = true;
    };
  }, []);

  return {
    projects,
    capabilities,
    connectionState,
  };
}
