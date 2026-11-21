import { useEffect, useRef, useState } from 'react';
import { useGetAbout } from '../../queries/useGetAbout';
import { useGetClients } from '../../queries/useGetClients';
import { Loading } from '../../components/Loading';
import { AnimatedQuote } from '../../components/AnimatedQuote';
import { useIsMobile } from '../../hooks/useIsMobile';
import {
  buildSanityImageSrcSet,
  getSanityImageUrl,
  IMAGE_WIDTHS,
} from '../../sanityImage';
import {
  AboutContainer,
  BeAboutImage,
  BioText,
  ClientContainer,
  ClientHeading,
  ClientsList,
  ClientText,
  ImageContainer,
  ImageOverlay,
  QuoteContainer,
  ScrollHintArrow,
} from './styles';

const ABOUT_IMAGE_OPTIONS = { width: IMAGE_WIDTHS.about };
const SWIPE_HINT_THRESHOLD_PX = 28;

function About() {
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const {
    data: aboutData,
    isLoading: aboutIsLoading,
    isError: aboutIsError,
  } = useGetAbout();
  const { data, isLoading, isError } = useGetClients();

  useEffect(() => {
    if (!isMobile || !showScrollHint) return;

    const container = containerRef.current;
    if (!container) return;

    let touchStartY: number | null = null;
    let dismissed = false;

    const dismiss = () => {
      if (dismissed) return;
      dismissed = true;
      setShowScrollHint(false);
    };

    const onTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0]?.clientY ?? null;
    };

    const onTouchMove = (event: TouchEvent) => {
      if (touchStartY === null) return;
      const currentY = event.touches[0]?.clientY;
      if (currentY === undefined) return;
      if (Math.abs(currentY - touchStartY) >= SWIPE_HINT_THRESHOLD_PX) {
        dismiss();
      }
    };

    const onScroll = () => {
      if (container.scrollTop > 2) dismiss();
    };

    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchmove', onTouchMove, { passive: true });
    container.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('scroll', onScroll);
    };
  }, [isMobile, showScrollHint]);

  if (aboutIsLoading || isLoading) {
    return <Loading />;
  }

  const quoteText =
    aboutData?.quote ?? 'i just want to create images full of life.';

  return (
    <AboutContainer ref={containerRef}>
      <QuoteContainer>
        <AnimatedQuote
          key={isMobile ? 'mono' : 'color'}
          monochrome={isMobile}
          quote={`“${quoteText}”`}
        />
        {isMobile ? (
          <ScrollHintArrow
            $visible={showScrollHint}
            aria-hidden={!showScrollHint}
          >
            <svg viewBox="0 0 24 36" fill="none" aria-hidden>
              <path
                d="M12 2v26M12 28l-7-7M12 28l7-7"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </ScrollHintArrow>
        ) : null}
      </QuoteContainer>
      {!aboutIsError && (
        <ImageContainer>
          <BeAboutImage
            src={getSanityImageUrl(aboutData?.image, ABOUT_IMAGE_OPTIONS)}
            srcSet={buildSanityImageSrcSet(
              aboutData?.image,
              ABOUT_IMAGE_OPTIONS
            )}
            alt="About"
          />
          <ImageOverlay />
          <BioText>{aboutData?.bio}</BioText>
        </ImageContainer>
      )}
      {!isError && (
        <ClientContainer>
          <ClientHeading>select clients</ClientHeading>
          <ClientsList>
            {data?.map((client, index) => (
              <ClientText key={client} $delay={index}>
                {client}
              </ClientText>
            ))}
          </ClientsList>
        </ClientContainer>
      )}
    </AboutContainer>
  );
}

export default About;
