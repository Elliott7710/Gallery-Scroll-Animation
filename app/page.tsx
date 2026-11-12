import CinematicGalleryReveal from "@/components/CinematicGalleryReveal";
import ScrollMarquee from "@/components/ScrollMarquee";
import StoryRail from "@/components/StoryRail";

export default function Home() {
  // embedded={false} makes the whole browser window the scroll area.
  // Anything passed as children appears between the showcase and contact sections.
  return (
    <CinematicGalleryReveal embedded={false}>
      <ScrollMarquee />
      <StoryRail />
    </CinematicGalleryReveal>
  );
}
