import { styled } from 'styled-components';
import { COLORS } from '../../constants';

export const WorkContainer = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding: 0.8rem;
  gap: 0.8rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
    padding: 0.6rem;
    gap: 0.6rem;
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    padding: 0.4rem;
    gap: 0.4rem;
  }
`;

export const ProjectTitle = styled.h3`
  font-family: 'Helvetica Neue Medium', sans-serif;
  font-size: 1.2rem;
  font-weight: bold;
  opacity: 0;
  transition: opacity 0.4s ease;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: ${COLORS.secondary};
  z-index: 2;
  padding: 0.8rem;
  text-align: center;
`;

export const ProjectImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
  display: block;
`;

export const ProjectCard = styled.div`
  width: 100%;
  aspect-ratio: 4 / 5;
  cursor: pointer;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0);
    transition: background-color 0.4s ease;
    z-index: 1;
    pointer-events: none;
  }

  &:hover {
    &::before {
      background-color: rgba(0, 0, 0, 0.5);
    }

    ${ProjectImage} {
      transform: scale(0.95);
    }

    ${ProjectTitle} {
      opacity: 1;
    }
  }
`;
