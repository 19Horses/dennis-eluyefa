import { keyframes, styled } from 'styled-components';
import { COLORS } from '../../constants';

const scatterFadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const GalleryContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  background-color: ${COLORS.primary};
  touch-action: none;
  user-select: none;
`;

export const ScatterImage = styled.img<{
  $delay: number;
  $width: number;
  $dragging: boolean;
}>`
  position: absolute;
  width: ${({ $width }) => $width}px;
  height: auto;
  max-width: min(42vw, 320px);
  display: block;
  cursor: ${({ $dragging }) => ($dragging ? 'grabbing' : 'grab')};
  opacity: 0;
  animation: ${scatterFadeIn} 0.7s ease forwards;
  animation-delay: ${({ $delay }) => $delay}s;
  z-index: ${({ $dragging }) => ($dragging ? 20 : 1)};
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.35);
  pointer-events: auto;
  -webkit-user-drag: none;

  &::selection {
    background-color: transparent;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    opacity: 1;
  }
`;
