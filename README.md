# Gallery Scroll Animation

## Website details
| Field | Details |
|---|---|
| Website name | Gemini Ai VibeCoding |
| Website link | https://gallery-scroll-animation.netlify.app |
| GitHub Repository | https://github.com/Elliott7710/Gallery-Scroll-Animation |

A scroll-driven landing page built with Next.js, TypeScript, GSAP (ScrollTrigger) and Lenis smooth scrolling.

- **Gallery reveal:** a 3x3 image wall zooms out as you scroll, the oversized corner logo shrinks and travels to the top, and the headline appears word by word.
- **Scroll ticker:** two rows of large text drift in opposite directions. They speed up and lean slightly when you scroll fast.
- **Latest drops:** a pinned horizontal gallery. Vertical scrolling moves the cards sideways, with parallax photos, a progress bar and a live counter.

All animations respect the reduced-motion setting, and the layout works on mobile.

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Project structure

```
app/
  layout.tsx      Page shell and metadata
  page.tsx        Puts the components together
  globals.css     Global resets
components/
  CinematicGalleryReveal.tsx   Hero, showcase and contact sections
  ScrollMarquee.tsx            Scroll-reactive text ticker
  StoryRail.tsx                Pinned horizontal gallery
```

## Customising

Text and images are set with props:

```tsx
<CinematicGalleryReveal
  embedded={false}
  brand="MY/BRAND"
  heading="Your headline goes here."
  buttonLabel="Enter"
  footerText="A short tagline"
  showcaseHeading="Second section title"
  contactHeading="Contact section title"
  images={["https://example.com/1.jpg", "https://example.com/2.jpg"]}
>
  <ScrollMarquee rows={[["Design", "Code"], ["Ship", "Repeat"]]} />
  <StoryRail
    heading="Latest drops"
    stories={[
      { title: "My first story", tag: "Tag", image: "https://example.com/a.jpg" },
      { title: "My second story", tag: "Tag", image: "https://example.com/b.jpg" },
    ]}
  />
</CinematicGalleryReveal>
```

- `images` takes up to nine URLs. Any you leave out fall back to the default photos from [Pexels](https://www.pexels.com).
- Anything passed as `children` appears between the showcase and contact sections, so you can add, remove or reorder sections.
- Keep `embedded={false}` when using `ScrollMarquee` or `StoryRail`. They are built for normal page scrolling.

## Built with

- [Next.js](https://nextjs.org)
- [GSAP](https://gsap.com) and ScrollTrigger
- [Lenis](https://lenis.darkroom.engineering)
