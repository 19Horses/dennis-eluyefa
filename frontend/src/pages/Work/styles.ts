import { styled } from 'styled-components';
import { COLORS } from '../../constants';
import { fadeIn } from '../../../styles/animations';

export const WorkWrapper = styled.div<{
  $fadeTop: number;
  $fadeBottom: number;
}>`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;

  &::before,
  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    z-index: 2;
    pointer-events: none;
    transition: opacity 0.3s ease, height 0.3s ease;
  }

  &::before {
    top: 0;
    background: linear-gradient(to bottom, ${COLORS.primary}, transparent);
    opacity: ${({ $fadeTop }) => $fadeTop / 1.4};
    height: ${({ $fadeTop }) => $fadeTop * 6}%;
    border-radius: 10px;
  }

  &::after {
    bottom: 0;
    background: linear-gradient(to top, ${COLORS.primary}, transparent);
    opacity: ${({ $fadeBottom }) => $fadeBottom / 1.4};
    height: ${({ $fadeBottom }) => $fadeBottom * 6}%;
    border-radius: 10px;
  }
`;

export const WorkContainer = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding: 0.5rem;
  gap: 0.5rem;
  overflow: auto;
  cursor: pointer;

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

  &::-webkit-scrollbar {
    display: none;
  }

  & {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

export const ProjectTitle = styled.p`
  font-family: 'Helvetica Neue Bold', sans-serif;
  font-size: 2rem;
  font-weight: bold;
  opacity: 0;
  transition: opacity 0.4s ease;
  position: absolute;
  max-width: 75%;
  margin: 0;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: ${COLORS.secondary};
  z-index: 2;
  padding: 0;
  text-align: center;
  cursor: pointer;

  &::selection {
    background-color: transparent;
  }
`;

export const ProjectImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
  display: block;
  cursor: pointer;

  &::selection {
    background-color: transparent;
  }
`;

export const ProjectCard = styled.div<{ $index?: number }>`
  width: 100%;
  aspect-ratio: 4 / 5;
  cursor: pointer;
  position: relative;
  opacity: 0;
  animation: ${fadeIn} 0.6s ease forwards;
  animation-delay: ${(props) => (props.$index ?? 0) * 0.1}s;

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
