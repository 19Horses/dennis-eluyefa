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
  SliderViewport,
  SliderTrack,
  Slide,
  SlideImageContainer,
  SlideImage,
  ProjectMeta,
  ProjectTitle,
  ProjectDate,
  ClickZoneLeft,
  ClickZoneRight,
  MobileGallery,
  MobileScroller,
  MobileSlide,
  MobileSlideImage,
  MobileCloseButton,
  MobileCloseIcon,
  MobileCounter,
} from './styles';

const GALLERY_IMAGE_OPTIONS = { width: IMAGE_WIDTHS.gallery };

export default function Project() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { data, isLoading, isError } = useGetProject(slug ?? '');
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const images = data?.images ?? [];
  const count = images.length;

  useEffect(() => {
    setCurrentIndex(0);
    if (scrollerRef.current) {
      scrollerRef.current.scrollLeft = 0;
    }
  }, [slug]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((i) => Math.max(0, i - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((i) => Math.min(count - 1, i + 1));
  }, [count]);

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
        ) : (
          <ProjectMeta>
            <ProjectTitle>{data?.title}</ProjectTitle>
            <ProjectDate>{formatDate(data?.date)}</ProjectDate>
          </ProjectMeta>
        )}
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
                <MobileSlide key={img._key}>
                  {src && (
                    <MobileSlideImage
                      src={src}
                      srcSet={srcSet}
                      alt={data?.title ?? ''}
                      loading={index === 0 ? 'eager' : 'lazy'}
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

  const slideOffset = count > 0 ? (currentIndex / count) * 100 : 0;

  return (
    <ProjectContainer>
      <SliderViewport>
        <SliderTrack
          $count={count}
          style={{
            transform: `translateX(-${slideOffset}%)`,
          }}
        >
          {images.map((img, index) => {
            const src = getSanityImageUrl(img, GALLERY_IMAGE_OPTIONS);
            const srcSet = buildSanityImageSrcSet(img, GALLERY_IMAGE_OPTIONS);
            return (
              <Slide key={img._key} $count={count}>
                <SlideImageContainer>
                  {src && (
                    <SlideImage
                      src={src}
                      srcSet={srcSet}
                      alt={data?.title ?? ''}
                      loading={index === 0 ? 'eager' : 'lazy'}
                    />
                  )}
                </SlideImageContainer>
                {index === 0 && (
                  <ProjectMeta>
                    <ProjectTitle>{data?.title}</ProjectTitle>
                    <ProjectDate>{formatDate(data?.date)}</ProjectDate>
                  </ProjectMeta>
                )}
              </Slide>
            );
          })}
        </SliderTrack>
      </SliderViewport>

      {count > 1 && (
        <>
          {currentIndex > 0 && (
            <ClickZoneLeft
              type="button"
              onClick={handlePrev}
              aria-label="Previous image"
            />
          )}
          {currentIndex < count - 1 && (
            <ClickZoneRight
              type="button"
              onClick={handleNext}
              aria-label="Next image"
            />
          )}
        </>
      )}
    </ProjectContainer>
  );
}
