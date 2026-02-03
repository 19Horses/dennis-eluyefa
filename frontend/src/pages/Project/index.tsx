import { useState, useCallback, useEffect } from 'react';
import { useParams } from 'react-router';
import { useGetProject } from '../../queries/useGetProjects';
import { formatDate } from '../../utils';
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
} from './styles';

export default function Project() {
  const { slug } = useParams();
  const { data, isLoading, isError } = useGetProject(slug ?? '');
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = data?.images ?? [];
  const count = images.length;

  useEffect(() => {
    setCurrentIndex(0);
  }, [slug]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((i) => Math.max(0, i - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((i) => Math.min(count - 1, i + 1));
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
        <ProjectMeta>
          <ProjectTitle>{data?.title}</ProjectTitle>
          <ProjectDate>{formatDate(data?.date)}</ProjectDate>
        </ProjectMeta>
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
          {images.map((img, index) => (
            <Slide key={img._key} $count={count}>
              <SlideImageContainer>
                {img.asset?.url && (
                  <SlideImage src={img.asset.url} alt={data?.title ?? ''} />
                )}
              </SlideImageContainer>
              {index === 0 && (
                <ProjectMeta>
                  <ProjectTitle>{data?.title}</ProjectTitle>
                  <ProjectDate>{formatDate(data?.date)}</ProjectDate>
                </ProjectMeta>
              )}
            </Slide>
          ))}
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
