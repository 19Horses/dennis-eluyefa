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
  ClientsHeadingRow,
  ClientsHintArrow,
  ClientsList,
  ClientsScroller,
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
  const clientsScrollerRef = useRef<HTMLDivElement | null>(null);
  const [hintReady, setHintReady] = useState(false);
  const [hintDismissed, setHintDismissed] = useState(false);
  const [clientsHintDismissed, setClientsHintDismissed] = useState(false);
  const {
    data: aboutData,
    isLoading: aboutIsLoading,
    isError: aboutIsError,
  } = useGetAbout();
  const { data, isLoading, isError } = useGetClients();

  const showScrollHint = isMobile && hintReady && !hintDismissed;
  const showClientsHint = isMobile && !clientsHintDismissed;

  useEffect(() => {
    if (!isMobile || !showScrollHint) return;

    const container = containerRef.current;
    if (!container) return;

    let touchStartY: number | null = null;
    let dismissed = false;

    const dismiss = () => {
      if (dismissed) return;
      dismissed = true;
      setHintDismissed(true);
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

  useEffect(() => {
    if (!isMobile || clientsHintDismissed) return;

    const scroller = clientsScrollerRef.current;
    if (!scroller) return;

    let touchStartX: number | null = null;
    let dismissed = false;

    const dismiss = () => {
      if (dismissed) return;
      dismissed = true;
      setClientsHintDismissed(true);
    };

    const onTouchStart = (event: TouchEvent) => {
      touchStartX = event.touches[0]?.clientX ?? null;
    };

    const onTouchMove = (event: TouchEvent) => {
      if (touchStartX === null) return;
      const currentX = event.touches[0]?.clientX;
      if (currentX === undefined) return;
      if (Math.abs(currentX - touchStartX) >= SWIPE_HINT_THRESHOLD_PX) {
        dismiss();
      }
    };

    const onScroll = () => {
      if (scroller.scrollLeft > 2) dismiss();
    };

    scroller.addEventListener('touchstart', onTouchStart, { passive: true });
    scroller.addEventListener('touchmove', onTouchMove, { passive: true });
    scroller.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      scroller.removeEventListener('touchstart', onTouchStart);
      scroller.removeEventListener('touchmove', onTouchMove);
      scroller.removeEventListener('scroll', onScroll);
    };
  }, [isMobile, clientsHintDismissed, data]);

  if (aboutIsLoading || isLoading) {
    return <Loading />;
  }

  const quoteText =
    aboutData?.quote ?? 'i just want to create images full of life.';
  const clients = data ?? [];

  return (
    <AboutContainer ref={containerRef}>
      <QuoteContainer>
        <AnimatedQuote
          key={isMobile ? 'mono' : 'color'}
          monochrome={isMobile}
          quote={`“${quoteText}”`}
          onRevealComplete={
            isMobile
              ? () => {
                  window.setTimeout(() => setHintReady(true), 180);
                }
              : undefined
          }
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
          <ClientsHeadingRow>
            <ClientHeading>select clients</ClientHeading>
            {isMobile ? (
              <ClientsHintArrow
                $visible={showClientsHint}
                aria-hidden={!showClientsHint}
              >
                <svg viewBox="0 0 36 24" fill="none" aria-hidden>
                  <path
                    d="M2 12h26M28 12l-7-7M28 12l-7 7"
                    stroke="currentColor"
                    strokeWidth="2.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </ClientsHintArrow>
            ) : null}
          </ClientsHeadingRow>
          <ClientsList>
            {clients.map((client, index) => (
              <ClientText key={client} $delay={index}>
                {client}
              </ClientText>
            ))}
          </ClientsList>
          <ClientsScroller ref={clientsScrollerRef} aria-label="Select clients">
            {clients.map((client, index) => (
              <ClientText key={client} $delay={index}>
                {client}
              </ClientText>
            ))}
          </ClientsScroller>
        </ClientContainer>
      )}
    </AboutContainer>
  );
}

export default About;
