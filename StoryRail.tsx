"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";

export interface Story {
  title: string;
  tag: string;
  image?: string;
}

export interface StoryRailProps {
  heading?: string;
  stories?: Story[];
}

const DEFAULT_STORIES: Story[] = [
  {
    title: "After Hours Runway",
    tag: "Fashion",
    image:
      "https://images.pexels.com/photos/35205573/pexels-photo-35205573.jpeg?auto=compress&cs=tinysrgb&w=1000&fit=crop",
  },
  {
    title: "Basement Frequencies",
    tag: "Sound",
    image:
      "https://images.pexels.com/photos/30758844/pexels-photo-30758844.jpeg?auto=compress&cs=tinysrgb&w=1000&fit=crop",
  },
  {
    title: "Thrift Flip Season",
    tag: "Youth",
    image:
      "https://images.pexels.com/photos/8973446/pexels-photo-8973446.jpeg?auto=compress&cs=tinysrgb&w=1000&fit=crop",
  },
  {
    title: "Street Casting Diaries",
    tag: "Culture",
    image:
      "https://images.pexels.com/photos/32983812/pexels-photo-32983812.jpeg?auto=compress&cs=tinysrgb&w=1000&fit=crop",
  },
  {
    title: "Night Bus Portraits",
    tag: "Photography",
    image:
      "https://images.pexels.com/photos/31781941/pexels-photo-31781941.jpeg?auto=compress&cs=tinysrgb&w=1000&fit=crop",
  },
];

const pad = (value: number) => String(value).padStart(2, "0");

export default function StoryRail({
  heading = "Latest drops",
  stories = DEFAULT_STORIES,
}: StoryRailProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const track = section.querySelector<HTMLElement>(".sr-track");
    const bar = section.querySelector<HTMLElement>(".sr-bar");
    const counter = section.querySelector<HTMLElement>(".sr-current");

    if (!track || !bar || !counter) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // No pinning: the row becomes a normal swipeable strip.
      section.classList.add("sr-static");
      return () => section.classList.remove("sr-static");
    }

    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      const images = gsap.utils.toArray<HTMLElement>(
        section.querySelectorAll(".sr-media img"),
      );

      gsap.set(images, { scale: 1.18, x: 0 });

      const getDistance = () =>
        Math.max(track.scrollWidth - section.clientWidth, 0);

      const update = (progress: number) => {
        gsap.set(track, { x: -getDistance() * progress });

        // Photos drift slightly slower than the cards for a parallax feel.
        gsap.set(images, { x: (0.5 - progress) * 70 });

        gsap.set(bar, { scaleX: progress });

        const index = Math.round(progress * (stories.length - 1));
        counter.textContent = pad(index + 1);
      };

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${getDistance()}`,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        // Lower priority so this refreshes after the hero's pin is measured.
        refreshPriority: -1,
        onRefresh: (self) => update(self.progress),
        onUpdate: (self) => update(self.progress),
      });
    }, section);

    return () => context.revert();
  }, [stories.length]);

  return (
    <section ref={sectionRef} className="sr-section">
      <style>{styles}</style>

      <header className="sr-head">
        <h3 className="sr-title">{heading}</h3>

        <p className="sr-count" aria-hidden="true">
          <span className="sr-current">01</span>
          <span className="sr-total"> / {pad(stories.length)}</span>
        </p>
      </header>

      <div className="sr-viewport">
        <ul className="sr-track">
          {stories.map((story, index) => (
            <li className="sr-card" key={`${story.title}-${index}`}>
              <div className="sr-media">
                {story.image && (
                  <img
                    src={story.image}
                    alt={story.title}
                    draggable={false}
                    loading="lazy"
                    decoding="async"
                  />
                )}
              </div>

              <div className="sr-meta">
                <span className="sr-index">{pad(index + 1)}</span>
                <span className="sr-tag">{story.tag}</span>
              </div>

              <h4 className="sr-card-title">{story.title}</h4>
            </li>
          ))}
        </ul>
      </div>

      <div className="sr-progress" aria-hidden="true">
        <span className="sr-bar" />
      </div>
    </section>
  );
}

/*
 * Selectors start with .cgr-root so they win over the hero component's
 * "reset everything" rules, which use the same specificity.
 */
const styles = `
.cgr-root .sr-section {
  display: grid;
  height: 100svh;
  grid-template-rows: auto 1fr auto;
  gap: clamp(1rem, 3vh, 2rem);
  padding-block: clamp(1.5rem, 5vh, 3.5rem);
  background:
    radial-gradient(circle at 15% 0%, rgba(217, 255, 67, 0.08), transparent 40%),
    #09090b;
}

.cgr-root .sr-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  padding-inline: clamp(1rem, 6vw, 6rem);
}

.cgr-root .sr-title {
  color: #ffffff;
  font-size: clamp(1.6rem, 4vw, 3.4rem);
  font-weight: 520;
  letter-spacing: -0.06em;
  line-height: 1;
}

.cgr-root .sr-count {
  color: rgba(255, 255, 255, 0.55);
  font-size: clamp(0.9rem, 1.4vw, 1.2rem);
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.04em;
}

.cgr-root .sr-current {
  color: #d9ff43;
}

.cgr-root .sr-viewport {
  display: flex;
  min-height: 0;
  align-items: center;
  overflow: hidden;
}

.cgr-root .sr-track {
  display: flex;
  width: max-content;
  gap: clamp(1rem, 2vw, 2rem);
  padding-inline: clamp(1rem, 6vw, 6rem);
  list-style: none;
  will-change: transform;
}

.cgr-root .sr-card {
  display: flex;
  flex: none;
  flex-direction: column;
  gap: 0.9rem;
  width: clamp(240px, 30vw, 460px);
}

.cgr-root .sr-media {
  position: relative;
  height: min(52svh, 520px);
  overflow: hidden;
  background: #18181d;
}

.cgr-root .sr-media img {
  display: block;
  width: 100%;
  height: 100%;
  max-width: none;
  object-fit: cover;
  filter: saturate(1.08) contrast(1.04);
  user-select: none;
  will-change: transform;
}

.cgr-root .sr-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  font-variant-numeric: tabular-nums;
}

.cgr-root .sr-card-title {
  color: #ffffff;
  font-size: clamp(1.15rem, 2vw, 1.7rem);
  font-weight: 540;
  letter-spacing: -0.045em;
  line-height: 1.05;
  transition: color 180ms ease;
}

.cgr-root .sr-card:hover .sr-card-title {
  color: #d9ff43;
}

.cgr-root .sr-progress {
  height: 2px;
  margin-inline: clamp(1rem, 6vw, 6rem);
  background: rgba(255, 255, 255, 0.14);
}

.cgr-root .sr-bar {
  display: block;
  width: 100%;
  height: 100%;
  background: #d9ff43;
  transform: scaleX(0);
  transform-origin: left;
}

@media (max-width: 540px) {
  .cgr-root .sr-card {
    width: 72vw;
  }
}

/* Reduced motion: no pinning, just a swipeable strip. */
.cgr-root .sr-static {
  display: block;
  height: auto;
  padding-block: 4rem;
}

.cgr-root .sr-static .sr-viewport {
  overflow-x: auto;
  margin-top: 2rem;
}

.cgr-root .sr-static .sr-progress {
  display: none;
}
`;
