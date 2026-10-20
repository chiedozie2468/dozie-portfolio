"use client";

import { ConvexHttpClient } from "convex/browser";
import { useCallback, useEffect, useState } from "react";

import { getConvexUrl } from "@/components/providers/convex-client-provider";
import { api } from "@/convex/_generated/api";
import {
  DEFAULT_SITE_SETTINGS,
  INITIAL_CAPABILITIES,
  INITIAL_PROJECTS,
  type CapabilityGroup,
  type PortfolioProject,
  type PortfolioSiteSettings,
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
  const [siteSettings, setSiteSettings] = useState<PortfolioSiteSettings>(
    DEFAULT_SITE_SETTINGS
  );
  const [connectionState, setConnectionState] =
    useState<ConvexConnectionState>("connecting");

  const loadFromConvex = useCallback(async () => {
    const client = new ConvexHttpClient(getConvexUrl());
    try {
      const result = await client.query(api.portfolio.getPortfolioData, {});

      if (result.projects && result.projects.length > 0) {
        setProjects(result.projects);
      }
      if (result.capabilities && result.capabilities.length > 0) {
        setCapabilities(result.capabilities);
      }
      if (result.siteSettings) {
        setSiteSettings(result.siteSettings);
      }
      setConnectionState("live");
    } catch {
      setConnectionState("awaiting-initial-deploy");
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const client = new ConvexHttpClient(getConvexUrl());

    async function run() {
      try {
        const result = await client.query(api.portfolio.getPortfolioData, {});
        if (cancelled) return;

        if (result.projects && result.projects.length > 0) {
          setProjects(result.projects);
        }
        if (result.capabilities && result.capabilities.length > 0) {
          setCapabilities(result.capabilities);
        }
        if (result.siteSettings) {
          setSiteSettings(result.siteSettings);
        }
        setConnectionState("live");
      } catch {
        if (!cancelled) {
          setConnectionState("awaiting-initial-deploy");
        }
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  return {
    projects,
    capabilities,
    siteSettings,
    connectionState,
    refresh: loadFromConvex,
  };
}
