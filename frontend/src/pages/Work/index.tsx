import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { Loading } from '../../components/Loading';
import { useGetProjects } from '../../queries/useGetProjects';
import {
  ProjectCard,
  ProjectImage,
  ProjectTitle,
  WorkContainer,
  WorkWrapper,
} from './styles';

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
            onClick={() => navigate(`/work/${project.slug.current}`)}
          >
            <ProjectImage
              src={project.images[0].asset?.url}
              alt={project.title}
            />
            <ProjectTitle>{project.title}</ProjectTitle>
          </ProjectCard>
        ))}
      </WorkContainer>
    </WorkWrapper>
  );
}

export default Work;
