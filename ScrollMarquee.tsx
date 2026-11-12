"use client";

import gsap from "gsap";
import { useLayoutEffect, useRef } from "react";

export interface ScrollMarqueeProps {
  /** Each inner array is one row of text. Rows alternate direction. */
  rows?: string[][];
}

const DEFAULT_ROWS = [
  ["Fashion", "Sound", "Youth culture", "Night shift"],
  ["Street casting", "Basement shows", "Thrift season", "After hours"],
];

/** Pixels moved per frame (at 60fps) when the page is not scrolling. */
const BASE_SPEED = 1.1;

export default function ScrollMarquee({
  rows = DEFAULT_ROWS,
}: ScrollMarqueeProps) {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const skewTarget = root.querySelector<HTMLElement>(".sm-skew");
    const rowElements = gsap.utils.toArray<HTMLElement>(
      root.querySelectorAll(".sm-row"),
    );

    if (!skewTarget || rowElements.length === 0) return;

    const items = rowElements.map((row) => {
      const track = row.querySelector<HTMLElement>(".sm-track")!;
      const group = track.querySelector<HTMLElement>(".sm-group")!;

      return {
        track,
        group,
        direction: Number(row.dataset.dir ?? -1),
        x: 0,
        width: group.offsetWidth,
      };
    });

    const measure = () => {
      items.forEach((item) => {
        item.width = item.group.offsetWidth;
      });
    };

    const resizeObserver = new ResizeObserver(measure);
    items.forEach((item) => resizeObserver.observe(item.group));

    let lastY = window.scrollY;
    let velocity = 0;
    let skew = 0;

    /*
     * Scroll speed is measured directly from window.scrollY each frame,
     * so it works with Lenis, native scrolling and anchor jumps alike.
     */
    const tick = () => {
      const delta = gsap.ticker.deltaRatio();
      const y = window.scrollY;
      const change = y - lastY;
      lastY = y;

      velocity += (change / delta - velocity) * 0.1;

      const boost = Math.min(Math.abs(velocity) * 0.6, 40);

      items.forEach((item) => {
        const move = (BASE_SPEED + boost) * delta * item.direction;
        item.x = gsap.utils.wrap(-item.width, 0, item.x + move);
        gsap.set(item.track, { x: item.x });
      });

      const skewGoal = gsap.utils.clamp(-6, 6, -velocity * 0.35);
      skew += (skewGoal - skew) * 0.15;
      gsap.set(skewTarget, { skewX: skew });
    };

    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      resizeObserver.disconnect();
      gsap.set([skewTarget, ...items.map((item) => item.track)], {
        clearProps: "transform",
      });
    };
  }, [rows]);

  return (
    <section
      ref={rootRef}
      className="sm-root"
      aria-label="Fashion, sound and youth culture"
    >
      <style>{styles}</style>

      <div className="sm-skew">
        {rows.map((row, rowIndex) => (
          <div
            className="sm-row"
            data-dir={rowIndex % 2 === 0 ? -1 : 1}
            key={`row-${rowIndex}`}
          >
            <div className="sm-track">
              {Array.from({ length: 4 }).map((_, groupIndex) => (
                <div
                  className="sm-group"
                  key={`group-${groupIndex}`}
                  aria-hidden={groupIndex > 0 ? "true" : undefined}
                >
                  {row.map((text, itemIndex) => (
                    <span className="sm-item" key={`${text}-${itemIndex}`}>
                      <span
                        className={
                          rowIndex % 2 === 0 ? "sm-solid" : "sm-outline"
                        }
                      >
                        {text}
                      </span>
                      <i className="sm-dot" aria-hidden="true" />
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/*
 * Selectors start with .cgr-root so they win over the hero component's
 * "reset everything" rules, which use the same specificity.
 */
const styles = `
.cgr-root .sm-root {
  min-height: 0;
  padding-block: clamp(3rem, 8vw, 7rem);
  background: linear-gradient(180deg, #171c13, #09090b);
}

.cgr-root .sm-skew {
  display: flex;
  flex-direction: column;
  gap: clamp(0.25rem, 1vw, 1rem);
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
  mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
  will-change: transform;
}

.cgr-root .sm-row {
  overflow: hidden;
}

.cgr-root .sm-track {
  display: flex;
  width: max-content;
  will-change: transform;
}

.cgr-root .sm-group {
  display: flex;
  flex: none;
  align-items: center;
}

.cgr-root .sm-item {
  display: inline-flex;
  align-items: center;
  font-size: clamp(3.5rem, 11vw, 10rem);
  font-weight: 520;
  letter-spacing: -0.07em;
  line-height: 1.05;
  white-space: nowrap;
}

.cgr-root .sm-solid {
  color: #ffffff;
}

.cgr-root .sm-outline {
  color: transparent;
  -webkit-text-stroke: 1.5px rgba(255, 255, 255, 0.55);
}

.cgr-root .sm-dot {
  display: inline-block;
  width: 0.2em;
  height: 0.2em;
  margin-inline: 0.45em;
  border-radius: 50%;
  background: #d9ff43;
}
`;
