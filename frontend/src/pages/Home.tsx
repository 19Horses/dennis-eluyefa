import Layout from '../components/Layout';
import { COLORS } from '../constants';
import { useGetLanding } from '../queries/useGetLanding';
import { useEffect, useMemo, useState } from 'react';
import { styled } from 'styled-components';

const HomeContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  position: relative;
  padding: 2rem;
`;

const HomeImage = styled.img<{ $isActive: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  inset: 8px;
  object-fit: cover;
  z-index: 0;
  opacity: ${({ $isActive }) => ($isActive ? 1 : 0)};
  transition: opacity 1500ms ease;
  pointer-events: none;

  &::selection {
    background-color: transparent;
    color: ${COLORS.secondary};
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const ImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${COLORS.primary};
  opacity: 0.15;
  z-index: 1;
`;

const HomeTitle = styled.p`
  font-family: 'Helvetica Neue Medium', sans-serif;
  font-size: clamp(1.125rem, 2.4vw, 1.75rem);
  line-height: 1.1;
  color: ${COLORS.secondary};
  z-index: 2;
  text-align: left;

  &::selection {
    background-color: ${COLORS.secondary};
    color: ${COLORS.tertiary};
  }
`;

function Home() {
  const { data, isLoading, isError } = useGetLanding();
  const [activeIndex, setActiveIndex] = useState(0);

  console.log(data);

  const imageUrls = useMemo(() => {
    return (
      data?.images
        ?.map((img) => img.asset?.url)
        .filter((url): url is string => Boolean(url)) ?? []
    );
  }, [data?.images]);

  useEffect(() => {
    if (imageUrls.length <= 1) return;

    const id = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % imageUrls.length);
    }, 5500);

    return () => window.clearInterval(id);
  }, [imageUrls.length]);


  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error!</p>;
  }

  return (
    <Layout>
      <HomeContainer>
        <HomeTitle>{data?.title}</HomeTitle>
        {imageUrls.map((url, idx) => (
          <HomeImage
            key={url}
            src={url}
            alt="Home"
            $isActive={idx === activeIndex}
          />
        ))}
        <ImageOverlay />
      </HomeContainer>
    </Layout>
  );
}

export default Home;
