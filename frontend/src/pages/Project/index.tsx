import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useGetProject } from '../../queries/useGetProjects';
import { formatDate } from '../../utils';
import { useIsMobile } from '../../hooks/useIsMobile';
import {
  buildSanityImageSrcSet,
  getSanityImageUrl,
  IMAGE_WIDTHS,
} from '../../sanityImage';
import { Loading } from '../../components/Loading';
import {
  ProjectContainer,
  DesktopScroller,
  DesktopSlide,
  DesktopSlideImage,
  ProjectMeta,
  ProjectTitle,
  ProjectDate,
  MobileGallery,
  MobileScroller,
  MobileSlide,
  MobileSlideImage,
  MobileCloseButton,
  MobileCloseIcon,
  MobileCounter,
} from './styles';

const GALLERY_IMAGE_OPTIONS = { width: IMAGE_WIDTHS.gallery };

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

export default function Project() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { data, isLoading, isError } = useGetProject(slug ?? '');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imagesReady, setImagesReady] = useState(false);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const desktopScrollerRef = useRef<HTMLDivElement | null>(null);

  const images = data?.images ?? [];
  const count = images.length;

  useEffect(() => {
    setCurrentIndex(0);
    setImagesReady(false);
    if (scrollerRef.current) {
      scrollerRef.current.scrollLeft = 0;
    }
    if (desktopScrollerRef.current) {
      desktopScrollerRef.current.scrollLeft = 0;
    }
  }, [slug]);

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
      if (!cancelled) {
        setImagesReady(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [count, images, slug]);

  useEffect(() => {
    if (isMobile) return;

    const scroller = desktopScrollerRef.current;
    if (!scroller) return;

    const onWheel = (event: WheelEvent) => {
      // Native horizontal gestures pass through.
      if (Math.abs(event.deltaY) < Math.abs(event.deltaX)) return;

      const maxScroll = scroller.scrollWidth - scroller.clientWidth;
      const atStart = scroller.scrollLeft <= 1;
      const atEnd = scroller.scrollLeft >= maxScroll - 1;
      const shouldScrollPage =
        maxScroll <= 1 ||
        (event.deltaY > 0 && atEnd) ||
        (event.deltaY < 0 && atStart);

      // At the gallery edge (or no horizontal overflow): scroll the page
      // so the footer / previous snap section stays reachable.
      if (shouldScrollPage) {
        const layout = document.querySelector<HTMLElement>(
          '[data-layout-scroll]'
        );
        if (!layout) return;
        event.preventDefault();
        layout.scrollTop += event.deltaY;
        return;
      }

      event.preventDefault();
      scroller.scrollLeft += event.deltaY;
    };

    scroller.addEventListener('wheel', onWheel, { passive: false });
    return () => scroller.removeEventListener('wheel', onWheel);
  }, [isMobile, count]);

  const handleMobileScroll = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller || scroller.clientWidth === 0) return;

    const nextIndex = Math.round(scroller.scrollLeft / scroller.clientWidth);
    setCurrentIndex(Math.min(Math.max(nextIndex, 0), Math.max(count - 1, 0)));
  }, [count]);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <p>Error!</p>;
  }

  if (count === 0) {
    return (
      <ProjectContainer>
        {isMobile ? (
          <MobileGallery>
            <MobileCloseButton
              type="button"
              aria-label="Close project"
              onClick={() => navigate('/work')}
            >
              <MobileCloseIcon />
            </MobileCloseButton>
            <ProjectMeta>
              <ProjectTitle>{data?.title}</ProjectTitle>
              <ProjectDate>{formatDate(data?.date)}</ProjectDate>
            </ProjectMeta>
          </MobileGallery>
        ) : null}
      </ProjectContainer>
    );
  }

  if (isMobile) {
    return (
      <ProjectContainer>
        <MobileGallery>
          <MobileCloseButton
            type="button"
            aria-label="Close project"
            onClick={() => navigate('/work')}
          >
            <MobileCloseIcon />
          </MobileCloseButton>

          <MobileScroller
            ref={scrollerRef}
            onScroll={handleMobileScroll}
            aria-label={`${data?.title ?? 'Project'} images`}
          >
            {images.map((img, index) => {
              const src = getSanityImageUrl(img, GALLERY_IMAGE_OPTIONS);
              const srcSet = buildSanityImageSrcSet(img, GALLERY_IMAGE_OPTIONS);

              return (
                <MobileSlide
                  key={img._key}
                  $index={index}
                  $reveal={imagesReady}
                >
                  {src && (
                    <MobileSlideImage
                      src={src}
                      srcSet={srcSet}
                      alt={data?.title ?? ''}
                      loading="eager"
                      draggable={false}
                    />
                  )}
                </MobileSlide>
              );
            })}
          </MobileScroller>

          <MobileCounter>
            {currentIndex + 1}/{count}
          </MobileCounter>
        </MobileGallery>
      </ProjectContainer>
    );
  }

  return (
    <ProjectContainer>
      <DesktopScroller
        ref={desktopScrollerRef}
        aria-label={`${data?.title ?? 'Project'} images`}
      >
        {images.map((img, index) => {
          const src = getSanityImageUrl(img, GALLERY_IMAGE_OPTIONS);
          const srcSet = buildSanityImageSrcSet(img, GALLERY_IMAGE_OPTIONS);

          return (
            <DesktopSlide key={img._key} $index={index} $reveal={imagesReady}>
              {src && (
                <DesktopSlideImage
                  src={src}
                  srcSet={srcSet}
                  alt={data?.title ?? ''}
                  loading="eager"
                  draggable={false}
                />
              )}
            </DesktopSlide>
          );
        })}
      </DesktopScroller>
    </ProjectContainer>
  );
}
