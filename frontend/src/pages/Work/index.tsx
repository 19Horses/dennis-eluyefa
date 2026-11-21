import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Loading } from '../../components/Loading';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useGetProjects, type ProjectType } from '../../queries/useGetProjects';
import {
  buildSanityImageSrcSet,
  getSanityImageUrl,
  IMAGE_WIDTHS,
} from '../../sanityImage';
import { ProjectOverlay } from './ProjectOverlay';
import {
  ProjectCard,
  ProjectImage,
  ProjectTitle,
  WORK_EXIT_MS,
  WorkContainer,
  WorkWrapper,
} from './styles';

const GRID_IMAGE_OPTIONS = { width: IMAGE_WIDTHS.grid };
const GALLERY_IMAGE_OPTIONS = { width: IMAGE_WIDTHS.gallery };
const PROJECT_QUERY_KEY = 'project';

const prefetchedGalleryUrls = new Set<string>();

function prefetchProjectGallery(project: ProjectType) {
  const firstImages = project.images?.slice(0, 2) ?? [];

  firstImages.forEach((image) => {
    const src = getSanityImageUrl(image, GALLERY_IMAGE_OPTIONS);
    if (!src || prefetchedGalleryUrls.has(src)) return;

    prefetchedGalleryUrls.add(src);
    const preload = new Image();
    preload.decoding = 'async';
    preload.src = src;
  });
}

function Work() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data, isLoading, isError } = useGetProjects();
  const containerRef = useRef<HTMLDivElement>(null);
  const exitingRef = useRef(false);
  const exitTimersRef = useRef<number[]>([]);
  const [fadeBottom, setFadeBottom] = useState(0);
  const [exitingSlug, setExitingSlug] = useState<string | null>(null);
  /** `others` = fade siblings; `selected` = then fade the chosen card */
  const [exitPhase, setExitPhase] = useState<'others' | 'selected' | null>(
    null
  );

  useEffect(
    () => () => {
      exitTimersRef.current.forEach((id) => window.clearTimeout(id));
    },
    []
  );

  const activeSlug = searchParams.get(PROJECT_QUERY_KEY);
  // Mobile keeps the in-place overlay; desktop always uses the project page.
  const overlayOpen = isMobile && Boolean(activeSlug);

  const updateFade = useCallback(() => {
    // Desktop work scrolls the page; bottom fade is mobile-only.
    if (!isMobile) {
      setFadeBottom(0);
      return;
    }

    const el = containerRef.current;
    if (!el) return;

    const ramp = 10;
    const min = 0.25;
    const distBottom = el.scrollHeight - el.scrollTop - el.clientHeight;

    const intensity = (dist: number) =>
      Math.min(1, min + ((1 - min) * Math.min(dist, ramp)) / ramp);

    setFadeBottom(intensity(distBottom));
  }, [isMobile]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !isMobile) {
      setFadeBottom(0);
      return;
    }

    updateFade();
    el.addEventListener('scroll', updateFade, { passive: true });

    const ro = new ResizeObserver(updateFade);
    ro.observe(el);

    return () => {
      el.removeEventListener('scroll', updateFade);
      ro.disconnect();
    };
  }, [updateFade, data, isMobile]);

  const resetExitAnimation = useCallback(() => {
    exitTimersRef.current.forEach((id) => window.clearTimeout(id));
    exitTimersRef.current = [];
    exitingRef.current = false;
    setExitingSlug(null);
    setExitPhase(null);
  }, []);

  const closeOverlay = useCallback(() => {
    const next = new URLSearchParams(searchParams);
    next.delete(PROJECT_QUERY_KEY);
    setSearchParams(next, { replace: true });
    // Restore grid after overlay exit so cards can fade back in.
    resetExitAnimation();
  }, [resetExitAnimation, searchParams, setSearchParams]);

  const openProject = useCallback(
    (slug: string) => {
      if (exitingRef.current) return;
      exitingRef.current = true;
      setExitingSlug(slug);
      setExitPhase('others');

      const fadeSelectedId = window.setTimeout(() => {
        setExitPhase('selected');
      }, WORK_EXIT_MS);

      const finishId = window.setTimeout(() => {
        if (isMobile) {
          const next = new URLSearchParams(searchParams);
          next.set(PROJECT_QUERY_KEY, slug);
          setSearchParams(next, { replace: false });
          return;
        }

        navigate(`/work/${slug}`);
      }, WORK_EXIT_MS * 2);

      exitTimersRef.current = [fadeSelectedId, finishId];
    },
    [isMobile, navigate, searchParams, setSearchParams]
  );

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <p>Error!</p>;
  }

  return (
    <WorkWrapper $fadeBottom={fadeBottom}>
      <WorkContainer ref={containerRef}>
        {data?.map((project, index) => {
          const slug = project.slug.current;
          const exitKeep = exitingSlug === slug && exitPhase === 'others';
          const exitSelected = exitingSlug === slug && exitPhase === 'selected';
          const exitHide = Boolean(exitingSlug) && exitingSlug !== slug;

          return (
            <ProjectCard
              key={project._id}
              $index={index}
              $exitHide={exitHide}
              $exitKeep={exitKeep}
              $exitSelected={exitSelected}
              onMouseEnter={() => prefetchProjectGallery(project)}
              onFocus={() => prefetchProjectGallery(project)}
              onClick={() => openProject(slug)}
            >
              <ProjectImage
                src={getSanityImageUrl(project.images[0], GRID_IMAGE_OPTIONS)}
                srcSet={buildSanityImageSrcSet(
                  project.images[0],
                  GRID_IMAGE_OPTIONS
                )}
                alt={project.title}
                loading="lazy"
              />
              <ProjectTitle>{project.title}</ProjectTitle>
            </ProjectCard>
          );
        })}
      </WorkContainer>

      {overlayOpen && activeSlug && (
        <ProjectOverlay slug={activeSlug} onClose={closeOverlay} />
      )}
    </WorkWrapper>
  );
}

export default Work;
