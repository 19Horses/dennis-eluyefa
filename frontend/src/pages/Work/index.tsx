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
  ViewModeButton,
  ViewModeToggle,
  WorkContainer,
  WorkWrapper,
} from './styles';

const GRID_IMAGE_OPTIONS = { width: IMAGE_WIDTHS.grid };
const GALLERY_IMAGE_OPTIONS = { width: IMAGE_WIDTHS.gallery };
const VIEW_MODE_KEY = 'work-project-view-mode';
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

function readStoredViewMode(): 1 | 2 {
  try {
    const stored = window.localStorage.getItem(VIEW_MODE_KEY);
    return stored === '2' ? 2 : 1;
  } catch {
    return 1;
  }
}

function Work() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data, isLoading, isError } = useGetProjects();
  const containerRef = useRef<HTMLDivElement>(null);
  const [fadeTop, setFadeTop] = useState(0);
  const [fadeBottom, setFadeBottom] = useState(0);
  const [viewMode, setViewMode] = useState<1 | 2>(readStoredViewMode);

  const activeSlug = searchParams.get(PROJECT_QUERY_KEY);
  // Desktop mode 2 + all mobile opens stay on /work with ?project= for a smoother fade.
  const overlayOpen = Boolean(activeSlug) && (isMobile || viewMode === 2);

  const updateFade = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const ramp = 10;
    const min = 0.25;
    const distTop = el.scrollTop;
    const distBottom = el.scrollHeight - el.scrollTop - el.clientHeight;

    const intensity = (dist: number) =>
      Math.min(1, min + ((1 - min) * Math.min(dist, ramp)) / ramp);

    setFadeTop(intensity(distTop));
    setFadeBottom(intensity(distBottom));
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    updateFade();
    el.addEventListener('scroll', updateFade, { passive: true });

    const ro = new ResizeObserver(updateFade);
    ro.observe(el);

    return () => {
      el.removeEventListener('scroll', updateFade);
      ro.disconnect();
    };
  }, [updateFade, data]);

  useEffect(() => {
    try {
      window.localStorage.setItem(VIEW_MODE_KEY, String(viewMode));
    } catch {
      // ignore quota / private mode failures
    }
  }, [viewMode]);

  const closeOverlay = useCallback(() => {
    const next = new URLSearchParams(searchParams);
    next.delete(PROJECT_QUERY_KEY);
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

  const openProject = useCallback(
    (slug: string) => {
      if (!isMobile && viewMode === 1) {
        navigate(`/work/${slug}`);
        return;
      }

      const next = new URLSearchParams(searchParams);
      next.set(PROJECT_QUERY_KEY, slug);
      setSearchParams(next, { replace: false });
    },
    [isMobile, navigate, searchParams, setSearchParams, viewMode]
  );

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <p>Error!</p>;
  }

  return (
    <WorkWrapper $fadeTop={fadeTop} $fadeBottom={fadeBottom}>
      <WorkContainer ref={containerRef}>
        {data?.map((project, index) => (
          <ProjectCard
            key={project._id}
            $index={index}
            onMouseEnter={() => prefetchProjectGallery(project)}
            onFocus={() => prefetchProjectGallery(project)}
            onClick={() => openProject(project.slug.current)}
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
        ))}
      </WorkContainer>

      <ViewModeToggle aria-label="Project view mode">
        <ViewModeButton
          type="button"
          $active={viewMode === 1}
          aria-pressed={viewMode === 1}
          onClick={() => setViewMode(1)}
        >
          1
        </ViewModeButton>
        <ViewModeButton
          type="button"
          $active={viewMode === 2}
          aria-pressed={viewMode === 2}
          onClick={() => setViewMode(2)}
        >
          2
        </ViewModeButton>
      </ViewModeToggle>

      {overlayOpen && activeSlug && (
        <ProjectOverlay slug={activeSlug} onClose={closeOverlay} />
      )}
    </WorkWrapper>
  );
}

export default Work;
