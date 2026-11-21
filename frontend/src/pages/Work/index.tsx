import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { Loading } from '../../components/Loading';
import { useGetProjects, type ProjectType } from '../../queries/useGetProjects';
import {
  buildSanityImageSrcSet,
  getSanityImageUrl,
  IMAGE_WIDTHS,
} from '../../sanityImage';
import {
  ProjectCard,
  ProjectImage,
  ProjectTitle,
  WorkContainer,
  WorkWrapper,
} from './styles';

const GRID_IMAGE_OPTIONS = { width: IMAGE_WIDTHS.grid };
const GALLERY_IMAGE_OPTIONS = { width: IMAGE_WIDTHS.gallery };

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
  const { data, isLoading, isError } = useGetProjects();
  const containerRef = useRef<HTMLDivElement>(null);
  const [fadeTop, setFadeTop] = useState(0);
  const [fadeBottom, setFadeBottom] = useState(0);

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
            onClick={() => navigate(`/work/${project.slug.current}`)}
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
    </WorkWrapper>
  );
}

export default Work;
