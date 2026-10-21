"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { SectionLineIcon } from "@/components/icons/section-line-icons";
import { useSectionFocus } from "@/components/providers/section-focus-provider";
import { type SectionId } from "@/lib/section-accents";
import { cn } from "@/lib/utils";

const BUBBLE_SECTIONS: {
  id: SectionId;
  shortLabel: string;
}[] = [
  {
    id: "hero",
    shortLabel: "Overview",
  },
  {
    id: "about",
    shortLabel: "About",
  },
  {
    id: "work",
    shortLabel: "Projects",
  },
  {
    id: "contact",
    shortLabel: "Contact",
  },
];

const TRACK_HEIGHT = 180;
const NODE_SPACING = TRACK_HEIGHT / (BUBBLE_SECTIONS.length - 1);

export function BubbleRopeScroll() {
  const { activeSection, setActiveSection } = useSectionFocus();
  const containerRef = useRef<HTMLDivElement | null>(null);

  const activeIdx = Math.max(
    0,
    BUBBLE_SECTIONS.findIndex((s) => s.id === activeSection)
  );
  const anchorY = activeIdx * NODE_SPACING;

  const [dragging, setDragging] = useState(false);
  const [pos, setPos] = useState<{ x: number; y: number }>({
    x: 0,
    y: anchorY,
  });
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  useEffect(() => {
    if (!dragging) {
      setPos({ x: 0, y: activeIdx * NODE_SPACING });
    }
  }, [activeIdx, dragging]);

  const navigateToSection = useCallback(
    (targetIdx: number) => {
      const clamped = Math.max(
        0,
        Math.min(BUBBLE_SECTIONS.length - 1, targetIdx)
      );
      const item = BUBBLE_SECTIONS[clamped];
      if (!item) return;

      setActiveSection(item.id);

      const el = document.querySelector<HTMLElement>(
        `[data-section-id="${item.id}"]`
      );
      if (el) {
        const header = document.querySelector<HTMLElement>("header");
        const headerHeight = header ? header.offsetHeight : 80;
        const top = Math.max(
          0,
          window.scrollY + el.getBoundingClientRect().top - headerHeight
        );
        window.scrollTo({ top, behavior: "smooth" });
      }
    },
    [setActiveSection]
  );

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relY = Math.max(
      -20,
      Math.min(TRACK_HEIGHT + 32, e.clientY - rect.top - 16)
    );
    const relX = Math.max(
      -38,
      Math.min(28, e.clientX - (rect.left + rect.width / 2))
    );
    setPos({ x: relX, y: relY });
  };

  const handlePointerUp = () => {
    if (!dragging) return;
    setDragging(false);

    if (
      pos.y > anchorY + 24 &&
      Math.round(pos.y / NODE_SPACING) === activeIdx
    ) {
      const next = (activeIdx + 1) % BUBBLE_SECTIONS.length;
      navigateToSection(next);
      setPos({ x: 0, y: next * NODE_SPACING });
      return;
    }

    const nearest = Math.max(
      0,
      Math.min(
        BUBBLE_SECTIONS.length - 1,
        Math.round(pos.y / NODE_SPACING)
      )
    );
    navigateToSection(nearest);
    setPos({ x: 0, y: nearest * NODE_SPACING });
  };

  const bx = 26 + (dragging ? pos.x : 0);
  const by = 18 + (dragging ? pos.y : anchorY);
  const ax = 26;
  const ay = 18 + anchorY;
  const cx = (ax + bx) / 2 + (dragging ? pos.x * 0.45 : 5);
  const cy = (ay + by) / 2;

  const previewIdx = dragging
    ? Math.max(
        0,
        Math.min(
          BUBBLE_SECTIONS.length - 1,
          Math.round(pos.y / NODE_SPACING)
        )
      )
    : hoveredIdx ?? activeIdx;
  const activeMeta = BUBBLE_SECTIONS[previewIdx] || BUBBLE_SECTIONS[0];

  return (
    <aside
      aria-label="Bubble & Rope Scroll Switcher"
      className="fixed top-1/2 right-2.5 z-40 hidden -translate-y-1/2 select-none md:flex lg:right-4"
    >
      {/* Light gray-100 visible scrollbar pill on the right side only — uncolored & transparent icons */}
      <div
        ref={containerRef}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{
          width: 52,
          height: TRACK_HEIGHT + 68,
        }}
        className="relative flex flex-col items-center rounded-full border border-gray-300/90 bg-gray-100/90 py-3 text-slate-800 shadow-[0_6px_24px_rgba(15,23,42,0.08)] backdrop-blur-md transition-colors duration-300 hover:bg-gray-100"
        title="Drag bubble or pull rope to switch section"
      >
        {/* Floating section label tooltip on hover/drag (transparent & uncolored icon) */}
        <div
          style={{
            top: by - 12,
          }}
          className={cn(
            "pointer-events-none absolute right-full mr-2.5 flex items-center gap-1.5 rounded-full border border-slate-300/80 bg-gray-100/95 px-2.5 py-1 font-mono text-[10px] tracking-wide whitespace-nowrap text-slate-800 shadow-xs backdrop-blur-md transition-opacity duration-200",
            dragging || hoveredIdx !== null ? "opacity-100" : "opacity-0"
          )}
        >
          <SectionLineIcon
            sectionId={activeMeta.id}
            className="size-4 text-slate-700 lg:size-5"
          />
          <span>{activeMeta.shortLabel}</span>
        </div>

        {/* Elastic Rope SVG (uncolored monochrome stroke) */}
        <svg
          width="52"
          height={TRACK_HEIGHT + 68}
          viewBox={`0 0 52 ${TRACK_HEIGHT + 68}`}
          className="pointer-events-none absolute inset-0 overflow-visible text-slate-600"
          aria-hidden="true"
        >
          <line
            x1="26"
            y1="18"
            x2="26"
            y2={18 + TRACK_HEIGHT}
            stroke="currentColor"
            strokeOpacity="0.32"
            strokeWidth="1.4"
            strokeDasharray="3 4"
          />
          <path
            d={`M ${ax} ${ay} Q ${cx} ${cy} ${bx} ${by}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={dragging ? "2.1" : "1.6"}
            strokeLinecap="round"
            strokeOpacity="0.75"
          />
          <path
            d={`M ${bx} ${by + 13} Q ${26 + (bx - 26) * 0.35} ${
              18 + TRACK_HEIGHT + 20
            } 26 ${18 + TRACK_HEIGHT + 36}`}
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.45"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        </svg>

        {/* Transparent, uncolored Section Icons along the rope */}
        {BUBBLE_SECTIONS.map((sec, idx) => {
          const ny = 18 + idx * NODE_SPACING;
          const isCurrent = idx === activeIdx;
          return (
            <button
              key={sec.id}
              type="button"
              onClick={() => navigateToSection(idx)}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              aria-label={`Switch to ${sec.shortLabel}`}
              style={{
                top: ny - 12,
                left: 26 - 12,
              }}
              className={cn(
                "absolute z-10 flex size-6 cursor-pointer items-center justify-center rounded-full bg-transparent text-slate-700 transition-all duration-300 hover:scale-125",
                isCurrent ? "opacity-100" : "opacity-60 hover:opacity-95"
              )}
            >
              <SectionLineIcon sectionId={sec.id} className="size-4.5 lg:size-5" />
            </button>
          );
        })}

        {/* Draggable Transparent Bubble showing the active Section Icon (e.g. talking face on About) */}
        <div
          role="slider"
          tabIndex={0}
          aria-label="Drag bubble on rope to switch section"
          aria-valuemin={0}
          aria-valuemax={BUBBLE_SECTIONS.length - 1}
          aria-valuenow={activeIdx}
          onPointerDown={handlePointerDown}
          onMouseEnter={() => setHoveredIdx(activeIdx)}
          onMouseLeave={() => setHoveredIdx(null)}
          style={{
            left: bx - 17,
            top: by - 17,
            transition: dragging
              ? "none"
              : "top 460ms cubic-bezier(0.34, 1.56, 0.64, 1), left 460ms cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
          className="absolute z-20 flex size-[34px] cursor-grab items-center justify-center rounded-full border border-slate-500/45 bg-white/45 text-slate-800 shadow-[inset_0_0_10px_rgba(255,255,255,0.8)] backdrop-blur-md active:cursor-grabbing"
        >
          <SectionLineIcon sectionId={activeMeta.id} className="size-5 lg:size-5.5" />
        </div>

        {/* Bottom Pull-Cord Droplet (transparent & uncolored) */}
        <button
          type="button"
          onClick={() =>
            navigateToSection((activeIdx + 1) % BUBBLE_SECTIONS.length)
          }
          title="Pull rope droplet to switch next section"
          style={{
            top: 18 + TRACK_HEIGHT + 30,
            left: 26 - 9,
          }}
          className="group absolute z-10 flex size-4.5 cursor-pointer items-center justify-center rounded-full border border-slate-500/45 bg-white/40 text-slate-700 backdrop-blur-md transition-transform duration-300 hover:translate-y-1 hover:scale-110"
        >
          <span className="size-1.5 rounded-full border border-current bg-transparent" />
        </button>
      </div>
    </aside>
  );
}
