"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useLayoutEffect, useMemo, useRef } from "react";

export interface CinematicGalleryRevealProps {
  images?: string[];
  brand?: string;
  heading?: string;
  buttonLabel?: string;
  footerText?: string;
  showcaseHeading?: string;
  contactHeading?: string;
  embedded?: boolean;
  /** Optional extra sections, shown between the showcase and contact sections. */
  children?: React.ReactNode;
}


const DEFAULT_IMAGES = [
  "https://images.pexels.com/photos/35205573/pexels-photo-35205573.jpeg?auto=compress&cs=tinysrgb&w=1600&fit=crop",
  "https://images.pexels.com/photos/30758844/pexels-photo-30758844.jpeg?auto=compress&cs=tinysrgb&w=1600&fit=crop",
  "https://images.pexels.com/photos/8973446/pexels-photo-8973446.jpeg?auto=compress&cs=tinysrgb&w=1600&fit=crop",
  "https://images.pexels.com/photos/32983812/pexels-photo-32983812.jpeg?auto=compress&cs=tinysrgb&w=1600&fit=crop",
  "https://images.pexels.com/photos/31781941/pexels-photo-31781941.jpeg?auto=compress&cs=tinysrgb&w=1600&fit=crop",
  "https://images.pexels.com/photos/34099824/pexels-photo-34099824.jpeg?auto=compress&cs=tinysrgb&w=1600&fit=crop",
  "https://images.pexels.com/photos/35003442/pexels-photo-35003442.jpeg?auto=compress&cs=tinysrgb&w=1600&fit=crop",
  "https://images.pexels.com/photos/29613981/pexels-photo-29613981.jpeg?auto=compress&cs=tinysrgb&w=1600&fit=crop",
  "https://images.pexels.com/photos/32940211/pexels-photo-32940211.jpeg?auto=compress&cs=tinysrgb&w=1600&fit=crop",
];

const clampProgress = (
  value: number,
  start: number,
  end: number,
) => gsap.utils.clamp(0, 1, (value - start) / (end - start));

const mix = (from: number, to: number, progress: number) =>
  from + (to - from) * progress;

export default function CinematicGalleryReveal({
  images,
  brand = "NOIR/24",
  heading = "Culture moves fast. We capture the moments worth remembering.",
  buttonLabel = "Enter the archive",
  footerText = "Fashion, sound and youth culture",
  showcaseHeading = "The New Energy",
  contactHeading = "Make Something Iconic",
  embedded = true,
  children,
}: CinematicGalleryRevealProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  const galleryImages = useMemo(() => {
    const customImages = images?.filter(Boolean).slice(0, 9) ?? [];

    return [
      ...customImages,
      ...DEFAULT_IMAGES.slice(customImages.length),
    ].slice(0, 9);
  }, [images]);

  const headingWords = useMemo(
    () => heading.trim().split(/\s+/),
    [heading],
  );

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);

    const content = root.querySelector<HTMLElement>(".cgr-content");
    const hero = root.querySelector<HTMLElement>(".cgr-hero");
    const heroInner =
      root.querySelector<HTMLElement>(".cgr-hero-inner");
    const gallery =
      root.querySelector<HTMLElement>(".cgr-gallery");
    const mark = root.querySelector<HTMLElement>(".cgr-mark");
    const footer =
      root.querySelector<HTMLElement>(".cgr-footer");
    const button =
      root.querySelector<HTMLElement>(".cgr-button");
    const overlay =
      root.querySelector<HTMLElement>(".cgr-overlay");

    const imageElements = gsap.utils.toArray<HTMLElement>(
      root.querySelectorAll(".cgr-card img"),
    );

    const wordElements = gsap.utils.toArray<HTMLElement>(
      root.querySelectorAll(".cgr-word"),
    );

    if (
      !content ||
      !hero ||
      !heroInner ||
      !gallery ||
      !mark ||
      !footer ||
      !button ||
      !overlay
    ) {
      return;
    }

    let lenis: Lenis | null = null;
    let animationFrame = 0;
    let resizeObserver: ResizeObserver | null = null;
    let heroTrigger: ScrollTrigger | null = null;

    const context = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (prefersReducedMotion) {
        gsap.set(gallery, { scale: 0.52 });
        gsap.set(imageElements, { scale: 1 });
        gsap.set([...wordElements, button], {
          opacity: 1,
          y: 0,
        });
        gsap.set(footer, { opacity: 0 });
        gsap.set(mark, { scale: 1 });

        return;
      }

      const scroller = embedded ? root : undefined;

      const getViewportHeight = () =>
        embedded ? root.clientHeight : window.innerHeight;

      let startingMarkScale =
        window.innerWidth <= 900 ? 2.2 : 5.7;

      gsap.set([...wordElements, button], {
        opacity: 0,
        y: 14,
      });

      lenis = embedded
        ? new Lenis({
            wrapper: root,
            content,
            lerp: 0.08,
            smoothWheel: true,
          })
        : new Lenis({
            lerp: 0.08,
            smoothWheel: true,
          });

      lenis.on("scroll", ScrollTrigger.update);

      const updateSmoothScroll = (time: number) => {
        lenis?.raf(time);
        animationFrame = requestAnimationFrame(
          updateSmoothScroll,
        );
      };

      animationFrame = requestAnimationFrame(
        updateSmoothScroll,
      );

      heroTrigger = ScrollTrigger.create({
        trigger: hero,
        scroller,
        start: "top top",
        end: () => `+=${getViewportHeight() * 3.7}`,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,

        onRefresh: () => {
          startingMarkScale =
            window.innerWidth <= 900 ? 2.2 : 5.7;
        },

        onUpdate: ({ progress }) => {
          const viewportHeight = getViewportHeight();

          /*
           * Gallery begins extremely large and settles into
           * the visible three-by-three editorial composition.
           */
          const galleryProgress = clampProgress(
            progress,
            0,
            0.7,
          );

          gsap.set(gallery, {
            scale: mix(1, 0.52, galleryProgress),
          });

          gsap.set(imageElements, {
            scale: mix(1.28, 1, galleryProgress),
          });

          /*
           * Oversized corner mark becomes a normal-sized logo
           * and travels toward the top of the viewport.
           */
          const markScale = mix(
            startingMarkScale,
            1,
            galleryProgress,
          );

          const markTravel =
            viewportHeight - mark.offsetHeight - 48;

          gsap.set(mark, {
            scale: markScale,
            y: -markTravel * galleryProgress,
          });

          /*
           * Footer disappears early so the centre copy
           * receives all of the attention.
           */
          const footerProgress = clampProgress(
            progress,
            0.04,
            0.24,
          );

          gsap.set(footer, {
            opacity: mix(1, 0, footerProgress),
            scale: mix(1, 0.78, footerProgress),
            filter: `blur(${mix(
              0,
              18,
              footerProgress,
            )}px)`,
          });

          /*
           * Reveal every word separately without requiring
           * GSAP's premium SplitText plugin.
           */
          const revealItems = [...wordElements, button];
          const revealStart = 0.13;
          const revealEnd = 0.62;

          const revealSpacing =
            (revealEnd - revealStart) /
            Math.max(revealItems.length, 1);

          revealItems.forEach((element, index) => {
            const itemStart =
              revealStart + revealSpacing * index;

            const itemProgress = clampProgress(
              progress,
              itemStart,
              itemStart + revealSpacing * 3,
            );

            gsap.set(element, {
              opacity: itemProgress,
              y: mix(14, 0, itemProgress),
            });
          });

          /*
           * Final handoff: lift the visual wall and fade
           * to black before the following section appears.
           */
          const handoffProgress = clampProgress(
            progress,
            0.78,
            1,
          );

          gsap.set(heroInner, {
            yPercent: mix(0, -24, handoffProgress),
            scale: mix(1, 0.96, handoffProgress),
          });

          gsap.set(overlay, {
            opacity: mix(0, 0.94, handoffProgress),
          });
        },
      });

      resizeObserver = new ResizeObserver(() => {
        ScrollTrigger.refresh();
      });

      resizeObserver.observe(root);

      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    }, root);

    return () => {
      heroTrigger?.kill();
      resizeObserver?.disconnect();
      cancelAnimationFrame(animationFrame);
      lenis?.destroy();
      context.revert();
    };
  }, [embedded, galleryImages]);

  const columns = [
    galleryImages.slice(0, 3),
    galleryImages.slice(3, 6),
    galleryImages.slice(6, 9),
  ];

  return (
    <div
      ref={rootRef}
      className={`cgr-root ${
        embedded ? "cgr-embedded" : ""
      }`}
    >
      <style>{styles}</style>

      <main className="cgr-content">
        <section className="cgr-hero">
          <div className="cgr-hero-inner">
            <div
              className="cgr-gallery"
              aria-hidden="true"
            >
              {columns.map((column, columnIndex) => (
                <div
                  className="cgr-column"
                  key={`column-${columnIndex}`}
                >
                  {column.map((source, imageIndex) => {
                    const globalIndex =
                      columnIndex * 3 + imageIndex;

                    return (
                      <figure
                        className="cgr-card"
                        key={`${source}-${globalIndex}`}
                      >
                        <img
                          src={source}
                          alt=""
                          draggable={false}
                          loading={
                            globalIndex < 3
                              ? "eager"
                              : "lazy"
                          }
                          decoding="async"
                        />

                        <span className="cgr-card-shine" />
                      </figure>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="cgr-mark">{brand}</div>

            <div className="cgr-copy">
              <p className="cgr-kicker">
                Independent creative archive
              </p>

              <h1>
                {headingWords.map((word, index) => (
                  <span
                    className="cgr-word"
                    key={`${word}-${index}`}
                  >
                    {word}
                  </span>
                ))}
              </h1>

              <a
                className="cgr-button"
                href="#cgr-showcase"
              >
                <span>{buttonLabel}</span>
                <span
                  className="cgr-button-icon"
                  aria-hidden="true"
                >
                  ↗
                </span>
              </a>
            </div>

            <p className="cgr-footer">{footerText}</p>
          </div>

          <div className="cgr-overlay" />
        </section>

        <section
          className="cgr-showcase"
          id="cgr-showcase"
        >
          <p className="cgr-section-label">
            Selected stories
          </p>

          <h2>{showcaseHeading}</h2>

          <p className="cgr-section-description">
            An evolving collection of visual culture,
            creative people and ideas defining what comes
            next.
          </p>
        </section>

        {children}

        <section
          className="cgr-contact"
          id="cgr-contact"
        >
          <p className="cgr-section-label">
            New collaborations
          </p>

          <h2>{contactHeading}</h2>

          <a
            className="cgr-contact-button"
            href="#cgr-showcase"
          >
            <span>Start a project</span>
            <span aria-hidden="true">↗</span>
          </a>
        </section>
      </main>
    </div>
  );
}

const styles = `
.cgr-root {
  position: relative;
  width: 100%;
  height: 100%;
  color: #ffffff;
  background: #09090b;
  font-family:
    Inter,
    ui-sans-serif,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
}

.cgr-root,
.cgr-root * {
  box-sizing: border-box;
}

.cgr-root * {
  margin: 0;
  padding: 0;
}

.cgr-root.cgr-embedded {
  height: 100svh;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: none;
}

.cgr-root.cgr-embedded::-webkit-scrollbar {
  display: none;
}

.cgr-content {
  position: relative;
  width: 100%;
}

.cgr-root section {
  position: relative;
  width: 100%;
  min-height: 100svh;
  overflow: hidden;
}

.cgr-hero {
  height: 100svh;
  background: #09090b;
}

.cgr-hero-inner {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  transform-origin: center top;
  will-change: transform;
}

.cgr-gallery {
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  width: calc(300% + 2rem);
  height: calc(300svh + 2rem);
  gap: 1rem;
  transform: translate(-50%, -50%);
  transform-origin: center;
  will-change: transform;
}

.cgr-column {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  gap: 1rem;
}

.cgr-card {
  position: relative;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  background: #18181d;
  isolation: isolate;
}

.cgr-card img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.28);
  filter: saturate(1.08) contrast(1.04);
  user-select: none;
  will-change: transform;
}

.cgr-card::before {
  position: absolute;
  inset: 0;
  z-index: 1;
  content: "";
  pointer-events: none;
  background:
    linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.06),
      transparent 35%,
      rgba(0, 0, 0, 0.2)
    );
}

.cgr-card::after {
  position: absolute;
  inset: 0;
  z-index: 2;
  content: "";
  pointer-events: none;
  opacity: 0.16;
  background-image:
    url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.45'/%3E%3C/svg%3E");
  mix-blend-mode: soft-light;
}

.cgr-card-shine {
  position: absolute;
  top: -40%;
  left: -80%;
  z-index: 3;
  width: 45%;
  height: 180%;
  pointer-events: none;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.16),
    transparent
  );
  transform: rotate(15deg);
}

.cgr-mark {
  position: absolute;
  bottom: 1.5rem;
  left: 1.5rem;
  z-index: 5;
  color: #ffffff;
  font-size: clamp(1.25rem, 2vw, 2rem);
  font-weight: 800;
  letter-spacing: -0.08em;
  line-height: 1;
  transform: scale(5.7);
  transform-origin: bottom left;
  white-space: nowrap;
  will-change: transform;
}

.cgr-copy {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 4;
  display: flex;
  width: min(820px, calc(100% - 3rem));
  flex-direction: column;
  align-items: center;
  gap: 1.8rem;
  text-align: center;
  transform: translate(-50%, -50%);
}

.cgr-kicker {
  color: rgba(255, 255, 255, 0.66);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.cgr-copy h1 {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  column-gap: 0.27em;
  color: #ffffff;
  font-size: clamp(2rem, 4.3vw, 5rem);
  font-weight: 520;
  letter-spacing: -0.067em;
  line-height: 0.98;
  text-wrap: balance;
  text-shadow: 0 4px 30px rgba(0, 0, 0, 0.25);
}

.cgr-word {
  display: inline-block;
  opacity: 0;
  will-change: opacity, transform;
}

.cgr-button {
  display: inline-flex;
  min-height: 56px;
  align-items: center;
  justify-content: center;
  gap: 1.2rem;
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 999px;
  padding: 0.75rem 0.75rem 0.75rem 1.45rem;
  color: #111114;
  background: #d9ff43;
  box-shadow:
    0 14px 45px rgba(217, 255, 67, 0.2),
    inset 0 1px rgba(255, 255, 255, 0.75);
  font-size: 0.9rem;
  font-weight: 750;
  text-decoration: none;
  opacity: 0;
  transition:
    transform 180ms ease,
    background-color 180ms ease,
    box-shadow 180ms ease;
  will-change: opacity, transform;
}

.cgr-button-icon {
  display: grid;
  width: 36px;
  height: 36px;
  place-items: center;
  border-radius: 50%;
  color: #ffffff;
  background: #111114;
  transition: transform 180ms ease;
}

.cgr-button:hover {
  background: #e5ff77;
  box-shadow:
    0 18px 55px rgba(217, 255, 67, 0.28),
    inset 0 1px rgba(255, 255, 255, 0.8);
  transform: translateY(-3px);
}

.cgr-button:hover .cgr-button-icon {
  transform: rotate(8deg);
}

.cgr-footer {
  position: absolute;
  right: 1.5rem;
  bottom: 1.5rem;
  z-index: 4;
  width: min(210px, 32vw);
  color: rgba(255, 255, 255, 0.88);
  font-size: clamp(1rem, 1.5vw, 1.45rem);
  font-weight: 540;
  letter-spacing: -0.045em;
  line-height: 1.08;
  will-change: opacity, transform, filter;
}

.cgr-overlay {
  position: absolute;
  inset: 0;
  z-index: 10;
  pointer-events: none;
  background: #050506;
  opacity: 0;
  will-change: opacity;
}

.cgr-showcase,
.cgr-contact {
  display: flex;
  min-height: 100svh;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: clamp(2rem, 7vw, 7rem);
  text-align: center;
}

.cgr-showcase {
  background:
    radial-gradient(
      circle at 50% -10%,
      rgba(217, 255, 67, 0.2),
      transparent 43%
    ),
    linear-gradient(180deg, #21291a, #171c13);
}

.cgr-contact {
  background:
    radial-gradient(
      circle at 50% 115%,
      rgba(132, 83, 255, 0.35),
      transparent 45%
    ),
    linear-gradient(180deg, #111014, #09090b);
}

.cgr-section-label {
  margin-bottom: 1.5rem;
  color: rgba(255, 255, 255, 0.55);
  font-size: 0.72rem;
  font-weight: 750;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.cgr-showcase h2,
.cgr-contact h2 {
  max-width: 1100px;
  color: #ffffff;
  font-size: clamp(3.2rem, 8.5vw, 9rem);
  font-weight: 520;
  letter-spacing: -0.08em;
  line-height: 0.87;
  text-wrap: balance;
}

.cgr-section-description {
  max-width: 550px;
  margin-top: 2rem;
  color: rgba(255, 255, 255, 0.62);
  font-size: clamp(1rem, 1.35vw, 1.25rem);
  line-height: 1.6;
}

.cgr-contact-button {
  display: inline-flex;
  align-items: center;
  gap: 1.5rem;
  margin-top: 2.5rem;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 999px;
  padding: 1rem 1.3rem 1rem 1.6rem;
  color: #ffffff;
  background: rgba(255, 255, 255, 0.06);
  font-weight: 700;
  text-decoration: none;
  backdrop-filter: blur(18px);
  transition:
    transform 180ms ease,
    background-color 180ms ease;
}

.cgr-contact-button span:last-child {
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border-radius: 50%;
  color: #111114;
  background: #d9ff43;
}

.cgr-contact-button:hover {
  background: rgba(255, 255, 255, 0.12);
  transform: translateY(-3px);
}

@media (max-width: 900px) {
  .cgr-gallery {
    width: calc(335% + 1.5rem);
    height: calc(300svh + 1.5rem);
    gap: 0.75rem;
  }

  .cgr-column {
    gap: 0.75rem;
  }

  .cgr-mark {
    bottom: 1.25rem;
    left: 1.25rem;
    transform: scale(2.2);
  }

  .cgr-copy {
    width: calc(100% - 2rem);
    gap: 1.4rem;
  }

  .cgr-copy h1 {
    font-size: clamp(2rem, 8vw, 3.8rem);
    line-height: 1;
  }

  .cgr-footer {
    right: auto;
    bottom: 16svh;
    left: 50%;
    width: 220px;
    text-align: center;
    transform: translateX(-50%);
  }
}

@media (max-width: 540px) {
  .cgr-gallery {
    width: calc(395% + 1rem);
    gap: 0.5rem;
  }

  .cgr-column {
    gap: 0.5rem;
  }

  .cgr-copy {
    top: 48%;
  }

  .cgr-copy h1 {
    font-size: clamp(1.9rem, 9.7vw, 3rem);
  }

  .cgr-kicker {
    font-size: 0.64rem;
  }

  .cgr-button {
    min-height: 50px;
    gap: 0.8rem;
    padding: 0.65rem 0.65rem 0.65rem 1.1rem;
    font-size: 0.82rem;
  }

  .cgr-button-icon {
    width: 34px;
    height: 34px;
  }

  .cgr-showcase h2,
  .cgr-contact h2 {
    font-size: clamp(2.8rem, 15vw, 5.7rem);
  }
}

@media (hover: hover) {
  .cgr-card:hover img {
    filter: saturate(1.18) contrast(1.06);
  }

  .cgr-card:hover .cgr-card-shine {
    animation: cgr-shine 850ms ease forwards;
  }
}

@keyframes cgr-shine {
  from {
    left: -80%;
  }

  to {
    left: 145%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .cgr-button,
  .cgr-button-icon,
  .cgr-contact-button {
    transition: none;
  }

  .cgr-card-shine {
    display: none;
  }
}
`;