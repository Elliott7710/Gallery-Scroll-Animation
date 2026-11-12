# Cinematic Gallery Reveal

## Website details
| Field | Details |
|---|---|
| Website name | Gemini Ai VibeCoding |
| Website link | https://gallery-scroll-animation.netlify.app |
| GitHub Repository | https://github.com/Elliott7710/Gallery-Scroll-Animation |

A scroll-driven hero built with Next.js, TypeScript, GSAP (ScrollTrigger) and Lenis smooth scrolling.

As you scroll, a 3x3 image wall zooms out, the oversized corner logo shrinks and travels to the top, the heading appears word by word, and the page fades into the next section.

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
  page.tsx        Renders the component
  globals.css     Global resets
components/
  CinematicGalleryReveal.tsx   The animated component
```

## Customising

All text and images can be changed with props:

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
/>
```

Pass up to nine image URLs. Any you leave out fall back to the default photos from [Pexels](https://www.pexels.com).

## Built with

- [Next.js](https://nextjs.org)
- [GSAP](https://gsap.com) and ScrollTrigger
- [Lenis](https://lenis.darkroom.engineering)
