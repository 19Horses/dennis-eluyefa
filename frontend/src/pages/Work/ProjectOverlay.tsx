import { useCallback, useEffect, useRef, useState } from 'react';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useGetProject } from '../../queries/useGetProjects';
import {
  buildSanityImageSrcSet,
  getSanityImageUrl,
  IMAGE_WIDTHS,
} from '../../sanityImage';
import {
  OverlayCloseButton,
  OverlayCounter,
  OverlayDim,
  OverlayRoot,
  OverlayScroller,
  OverlaySlide,
  OverlaySlideImage,
  OverlayStage,
} from './styles';

const GALLERY_IMAGE_OPTIONS = { width: IMAGE_WIDTHS.gallery };
const EXIT_SLIDE_MS = 450;

function preloadImage(src: string) {
  return new Promise<void>((resolve) => {
    const image = new Image();
    const settle = () => resolve();

    image.onload = settle;
    image.onerror = settle;
    image.src = src;

    if (image.complete) {
      settle();
      return;
    }

    if (typeof image.decode === 'function') {
      image.decode().then(settle).catch(settle);
    }
  });
}

type ProjectOverlayProps = {
  slug: string;
  onClose: () => void;
};

export function ProjectOverlay({ slug, onClose }: ProjectOverlayProps) {
  const isMobile = useIsMobile();
  const { data, isLoading, isError } = useGetProject(slug);
  const [imagesReady, setImagesReady] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const exitStartedRef = useRef(false);

  const images = data?.images ?? [];
  const count = images.length;

  const requestClose = useCallback(() => {
    if (exitStartedRef.current) return;
    exitStartedRef.current = true;
    setExiting(true);
  }, []);

  useEffect(() => {
    setImagesReady(false);
    setExiting(false);
    setCurrentIndex(0);
    exitStartedRef.current = false;
    if (scrollerRef.current) {
      scrollerRef.current.scrollLeft = 0;
    }
  }, [slug]);

  // Kill Safari’s vertical rubber-band while the mobile project overlay is open.
  useEffect(() => {
    if (!isMobile) return;

    const html = document.documentElement;
    const { body } = document;
    const prevHtmlOverscroll = html.style.overscrollBehavior;
    const prevBodyOverscroll = body.style.overscrollBehavior;
    const prevBodyOverflow = body.style.overflow;

    html.style.overscrollBehavior = 'none';
    body.style.overscrollBehavior = 'none';
    body.style.overflow = 'hidden';

    return () => {
      html.style.overscrollBehavior = prevHtmlOverscroll;
      body.style.overscrollBehavior = prevBodyOverscroll;
      body.style.overflow = prevBodyOverflow;
    };
  }, [isMobile]);

  useEffect(() => {
    if (count === 0) {
      setImagesReady(true);
      return;
    }

    let cancelled = false;
    setImagesReady(false);

    const urls = images
      .map((image) => getSanityImageUrl(image, GALLERY_IMAGE_OPTIONS))
      .filter((src): src is string => Boolean(src));

    Promise.all(urls.map(preloadImage)).then(() => {
      if (!cancelled) setImagesReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, [count, images, slug]);

  useEffect(() => {
    if (isMobile) return;

    const scroller = scrollerRef.current;
    if (!scroller) return;

    const onWheel = (event: WheelEvent) => {
      if (exiting) return;
      if (Math.abs(event.deltaY) < Math.abs(event.deltaX)) return;
      event.preventDefault();
      scroller.scrollLeft += event.deltaY;
    };

    scroller.addEventListener('wheel', onWheel, { passive: false });
    return () => scroller.removeEventListener('wheel', onWheel);
  }, [count, slug, exiting, isMobile]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') requestClose();
    };
    const onNavClose = () => requestClose();

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('project-overlay-close', onNavClose);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('project-overlay-close', onNavClose);
    };
  }, [requestClose]);

  const handleMobileScroll = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller || scroller.clientWidth === 0) return;

    const nextIndex = Math.round(scroller.scrollLeft / scroller.clientWidth);
    setCurrentIndex(Math.min(Math.max(nextIndex, 0), Math.max(count - 1, 0)));
  }, [count]);

  useEffect(() => {
    if (!exiting) return;

    // Wait for shared image + dim fade to finish before unmounting.
    const timeoutId = window.setTimeout(() => {
      onCloseRef.current();
    }, EXIT_SLIDE_MS + 40);

    return () => window.clearTimeout(timeoutId);
  }, [exiting]);

  return (
    <OverlayRoot $exiting={exiting} role="presentation">
      <OverlayDim
        $exiting={exiting}
        $exitDurationMs={EXIT_SLIDE_MS}
        $opaque={isMobile}
        onClick={requestClose}
      />

      <OverlayStage
        $mobile={isMobile}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={data?.title ?? 'Project images'}
      >
        {isLoading || isError ? null : (
          <OverlayScroller
            ref={scrollerRef}
            $mobile={isMobile}
            onScroll={isMobile ? handleMobileScroll : undefined}
          >
            {images.map((img, index) => {
              const src = getSanityImageUrl(img, GALLERY_IMAGE_OPTIONS);
              const srcSet = buildSanityImageSrcSet(img, GALLERY_IMAGE_OPTIONS);

              return (
                <OverlaySlide
                  key={img._key}
                  $index={index}
                  $reveal={imagesReady}
                  $exiting={exiting}
                  $mobile={isMobile}
                >
                  {src && (
                    <OverlaySlideImage
                      $mobile={isMobile}
                      src={src}
                      srcSet={srcSet}
                      alt={data?.title ?? ''}
                      loading="eager"
                      draggable={false}
                    />
                  )}
                </OverlaySlide>
              );
            })}
          </OverlayScroller>
        )}
      </OverlayStage>

      <OverlayCloseButton
        type="button"
        $exiting={exiting}
        $mobile={isMobile}
        aria-label="Close project"
        onClick={(event) => {
          event.stopPropagation();
          requestClose();
        }}
      >
        ×
      </OverlayCloseButton>

      {isMobile && count > 0 ? (
        <OverlayCounter $exiting={exiting}>
          {currentIndex + 1}/{count}
        </OverlayCounter>
      ) : null}
    </OverlayRoot>
  );
}
