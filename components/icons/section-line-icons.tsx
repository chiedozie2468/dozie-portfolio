"use client";

import type { SectionId } from "@/lib/section-accents";
import { cn } from "@/lib/utils";

const LIVE_PERSON_KEYFRAMES = `
  @keyframes livePersonBob {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-1.4px); }
  }
  @keyframes liveArmWave {
    0%, 100% { transform: rotate(0deg); }
    50% { transform: rotate(-22deg); }
  }
  @keyframes liveLegStrideA {
    0%, 100% { transform: rotate(-16deg); }
    50% { transform: rotate(16deg); }
  }
  @keyframes liveLegStrideB {
    0%, 100% { transform: rotate(16deg); }
    50% { transform: rotate(-16deg); }
  }
  @keyframes liveTypeHands {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-1.6px); }
  }
  @keyframes liveSignalWave {
    0%, 100% { opacity: 0.25; transform: translateX(0px); }
    50% { opacity: 1; transform: translateX(1.2px); }
  }
`;

/**
 * 1. Overview / Home: Live animated person waving hello
 */
export function OverviewLineIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("size-4 overflow-visible bg-transparent", className)}
      aria-hidden="true"
    >
      <style>{LIVE_PERSON_KEYFRAMES}</style>
      {/* Animated bobbing head */}
      <circle
        cx="11"
        cy="5.5"
        r="2.6"
        style={{ animation: "livePersonBob 1.1s ease-in-out infinite" }}
      />
      {/* Torso */}
      <line x1="11" y1="8.5" x2="11" y2="15.5" />
      {/* Left resting arm */}
      <path d="M11 10L7.5 13.5" />
      {/* Right live waving arm */}
      <path
        d="M11 10L15.5 7L17.5 4.5"
        style={{
          transformOrigin: "11px 10px",
          animation: "liveArmWave 0.75s ease-in-out infinite",
        }}
      />
      {/* Legs */}
      <path d="M11 15.5L8.5 21" />
      <path d="M11 15.5L13.5 21" />
    </svg>
  );
}

/**
 * 2. About: Live animated person walking / striding forward with swinging arms & legs
 */
export function TalkingFaceIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("size-4 overflow-visible bg-transparent", className)}
      aria-hidden="true"
    >
      <style>{LIVE_PERSON_KEYFRAMES}</style>
      {/* Head */}
      <circle
        cx="12"
        cy="5"
        r="2.5"
        style={{ animation: "livePersonBob 0.8s ease-in-out infinite" }}
      />
      {/* Torso */}
      <line x1="12" y1="8" x2="11.5" y2="14.5" />
      {/* Swinging Arms */}
      <path
        d="M8 12.5L12 9L16 12"
        style={{
          transformOrigin: "12px 9px",
          animation: "liveLegStrideB 0.8s ease-in-out infinite",
        }}
      />
      {/* Striding Leg 1 */}
      <path
        d="M11.5 14.5L8.5 21"
        style={{
          transformOrigin: "11.5px 14.5px",
          animation: "liveLegStrideA 0.8s ease-in-out infinite",
        }}
      />
      {/* Striding Leg 2 */}
      <path
        d="M11.5 14.5L15 21"
        style={{
          transformOrigin: "11.5px 14.5px",
          animation: "liveLegStrideB 0.8s ease-in-out infinite",
        }}
      />
    </svg>
  );
}

/**
 * 3. Projects / Work: Live animated person building / coding at a laptop
 */
export function ProjectLineIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("size-4 overflow-visible bg-transparent", className)}
      aria-hidden="true"
    >
      <style>{LIVE_PERSON_KEYFRAMES}</style>
      {/* Person Head */}
      <circle
        cx="9"
        cy="6"
        r="2.5"
        style={{ animation: "livePersonBob 1s ease-in-out infinite" }}
      />
      {/* Person Back/Shoulders */}
      <path d="M4.5 19c0-3.2 2-5.5 4.5-5.5" />
      <line x1="9" y1="8.8" x2="9" y2="15" />
      {/* Live typing arms reaching to laptop */}
      <path
        d="M9 11.5L14 14.2"
        style={{ animation: "liveTypeHands 0.45s ease-in-out infinite" }}
      />
      {/* Laptop Screen & Base */}
      <path d="M13.5 15.5H20.5L21.5 11H16L15 15.5" />
      <line x1="12" y1="18" x2="21.5" y2="18" />
    </svg>
  );
}

/**
 * 4. Contact: Live animated person reaching out / calling with live signal waves
 */
export function ContactLineIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("size-4 overflow-visible bg-transparent", className)}
      aria-hidden="true"
    >
      <style>{LIVE_PERSON_KEYFRAMES}</style>
      {/* Person Head */}
      <circle
        cx="9.5"
        cy="6"
        r="2.6"
        style={{ animation: "livePersonBob 1.1s ease-in-out infinite" }}
      />
      {/* Person Body */}
      <path d="M4.5 20c0-3.5 2.2-6 5-6s5 2.5 5 6" />
      {/* Arm holding phone / gesturing */}
      <path
        d="M12.5 12L15.5 8.5"
        style={{
          transformOrigin: "12.5px 12px",
          animation: "liveArmWave 0.9s ease-in-out infinite",
        }}
      />
      {/* Live communication waves radiating outward */}
      <path
        d="M17.5 6.5c1 1 1 2.8 0 3.8"
        style={{ animation: "liveSignalWave 1.1s ease-in-out infinite" }}
      />
      <path
        d="M19.8 5c1.8 1.8 1.8 5 0 6.8"
        style={{
          animation: "liveSignalWave 1.1s ease-in-out 0.35s infinite",
        }}
      />
    </svg>
  );
}

export function SectionLineIcon({
  sectionId,
  className,
}: {
  sectionId: SectionId;
  className?: string;
}) {
  switch (sectionId) {
    case "about":
      return <TalkingFaceIcon className={className} />;
    case "work":
    case "capabilities":
      return <ProjectLineIcon className={className} />;
    case "contact":
      return <ContactLineIcon className={className} />;
    case "hero":
    default:
      return <OverviewLineIcon className={className} />;
  }
}
