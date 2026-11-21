import { styled } from 'styled-components';
import { COLORS } from '../../constants';
import {
  fadeIn,
  fadeInOpacity,
  fadeOut,
  fadeOutDown,
} from '../../../styles/animations';

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

export const ViewModeToggle = styled.div`
  position: absolute;
  left: 0.85rem;
  bottom: 0.85rem;
  z-index: 6;
  display: flex;
  align-items: center;
  gap: 0.15rem;
  padding: 0.35rem 0.4rem;
  pointer-events: auto;
  background: rgba(0, 0, 0, 0.55);
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.55), 0 1px 0 rgba(255, 255, 255, 0.08);

  @media (max-width: 768px) {
    display: none;
  }
`;

export const ViewModeButton = styled.button<{ $active: boolean }>`
  border: 0;
  padding: 0.35rem 0.7rem;
  margin: 0;
  background: transparent;
  color: ${COLORS.secondary};
  font-family: 'Helvetica Neue Bold', sans-serif;
  font-size: 1.35rem;
  font-weight: bold;
  line-height: 1;
  cursor: pointer;
  opacity: ${({ $active }) => ($active ? 1 : 0.4)};
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.65);
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 1;
  }

  &:focus-visible {
    outline: 1px solid ${COLORS.secondary};
    outline-offset: 2px;
  }
`;

export const OverlayRoot = styled.div<{ $exiting?: boolean }>`
  position: absolute;
  inset: 0;
  z-index: 4;
  pointer-events: ${({ $exiting }) => ($exiting ? 'none' : 'auto')};
`;

/* Dim layer only — sibling to images so opacity fades independently */
export const OverlayDim = styled.div<{
  $exiting?: boolean;
  $exitDurationMs?: number;
  $opaque?: boolean;
}>`
  position: absolute;
  inset: 0;
  background: ${({ $opaque }) =>
    $opaque ? COLORS.primary : 'rgba(0, 0, 0, 0.78)'};
  cursor: pointer;
  animation-name: ${({ $exiting }) => ($exiting ? fadeOut : fadeInOpacity)};
  animation-duration: ${({ $exiting, $exitDurationMs }) =>
    $exiting ? `${($exitDurationMs ?? 450) / 1000}s` : '0.35s'};
  animation-timing-function: ease;
  animation-fill-mode: both;
`;

export const OverlayStage = styled.div<{ $mobile?: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: ${({ $mobile }) => ($mobile ? '0' : 'auto')};
  z-index: 1;
  display: flex;
  align-items: stretch;
  justify-content: center;
  /* Match WorkContainer padding so overlay images share the same inset */
  padding: ${({ $mobile }) => ($mobile ? '0' : '0.5rem')};
  box-sizing: border-box;
  height: ${({ $mobile }) => ($mobile ? '100%' : '86%')};
  min-height: 0;
  cursor: default;

  @media (max-width: 1024px) {
    padding: ${({ $mobile }) => ($mobile ? '0' : '0.6rem')};
  }
`;

export const OverlayScroller = styled.div<{ $mobile?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  /* Match WorkContainer gap */
  gap: ${({ $mobile }) => ($mobile ? '0' : '0.5rem')};
  width: 100%;
  height: 100%;
  padding: 0;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-behavior: ${({ $mobile }) => ($mobile ? 'smooth' : 'auto')};
  scroll-snap-type: ${({ $mobile }) => ($mobile ? 'x mandatory' : 'none')};
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: ${({ $mobile }) => ($mobile ? 'contain' : 'none')};
  scrollbar-width: none;
  box-sizing: border-box;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 1024px) {
    gap: ${({ $mobile }) => ($mobile ? '0' : '0.6rem')};
  }
`;

export const OverlaySlide = styled.div<{
  $index: number;
  $reveal: boolean;
  $exiting: boolean;
  $mobile?: boolean;
}>`
  flex: ${({ $mobile }) => ($mobile ? '0 0 100%' : '0 0 auto')};
  width: ${({ $mobile }) => ($mobile ? '100%' : 'auto')};
  height: 100%;
  display: flex;
  align-items: ${({ $mobile }) => ($mobile ? 'center' : 'stretch')};
  justify-content: ${({ $mobile }) => ($mobile ? 'center' : 'flex-start')};
  box-sizing: border-box;
  padding: ${({ $mobile }) => ($mobile ? '3.5rem 1rem' : '0')};
  scroll-snap-align: ${({ $mobile }) => ($mobile ? 'center' : 'none')};
  scroll-snap-stop: ${({ $mobile }) => ($mobile ? 'always' : 'normal')};
  opacity: ${({ $exiting }) => ($exiting ? 1 : 0)};
  animation-name: ${({ $exiting, $reveal }) =>
    $exiting ? fadeOutDown : $reveal ? fadeIn : 'none'};
  animation-duration: ${({ $exiting }) => ($exiting ? '0.45s' : '0.65s')};
  animation-timing-function: ease;
  animation-fill-mode: forwards;
  /* Exit together; entrance keeps stagger */
  animation-delay: ${({ $exiting, $reveal, $index }) =>
    $exiting ? '0s' : $reveal ? `${$index * 0.1}s` : '0s'};

  @media (prefers-reduced-motion: reduce) {
    opacity: ${({ $reveal, $exiting }) => ($reveal && !$exiting ? 1 : 0)};
    animation: none;
  }
`;

export const OverlaySlideImage = styled.img<{ $mobile?: boolean }>`
  height: ${({ $mobile }) => ($mobile ? 'auto' : '100%')};
  width: ${({ $mobile }) => ($mobile ? 'auto' : 'auto')};
  max-width: ${({ $mobile }) => ($mobile ? '100%' : 'none')};
  max-height: ${({ $mobile }) => ($mobile ? '100%' : 'none')};
  object-fit: ${({ $mobile }) => ($mobile ? 'contain' : 'initial')};
  display: block;
  user-select: none;
  -webkit-user-drag: none;
  pointer-events: none;

  &::selection {
    background-color: transparent;
  }
`;

export const OverlayCloseButton = styled.button<{
  $exiting?: boolean;
  $mobile?: boolean;
}>`
  position: absolute;
  right: ${({ $mobile }) => ($mobile ? '0.75rem' : '1.25rem')};
  top: ${({ $mobile }) => ($mobile ? '0.65rem' : 'auto')};
  bottom: ${({ $mobile }) => ($mobile ? 'auto' : '0.85rem')};
  z-index: 5;
  border: 0;
  padding: 0;
  width: ${({ $mobile }) => ($mobile ? '2.25rem' : 'auto')};
  height: ${({ $mobile }) => ($mobile ? '2.25rem' : 'auto')};
  display: ${({ $mobile }) => ($mobile ? 'inline-flex' : 'block')};
  align-items: center;
  justify-content: center;
  background: transparent;
  color: ${COLORS.secondary};
  font-family: 'Helvetica Neue Bold', sans-serif;
  /* Mobile: match burger control (~2.25rem); desktop keeps large bottom × */
  font-size: ${({ $mobile }) =>
    $mobile ? '2.25rem' : 'clamp(2.8rem, 5vw, 4.5rem)'};
  font-weight: bold;
  line-height: 1;
  cursor: pointer;
  opacity: ${({ $exiting }) => ($exiting ? 0 : 1)};
  transition: opacity 0.45s ease;

  &:hover {
    opacity: ${({ $exiting }) => ($exiting ? 0 : 0.7)};
  }

  &:focus-visible {
    outline: 1px solid ${COLORS.secondary};
    outline-offset: 3px;
  }
`;

export const OverlayCounter = styled.p<{ $exiting?: boolean }>`
  position: absolute;
  right: 0.75rem;
  bottom: 0.75rem;
  z-index: 5;
  margin: 0;
  font-family: 'Helvetica Neue Bold', sans-serif;
  font-size: 1.2rem;
  font-weight: bold;
  line-height: 1;
  letter-spacing: 0.02em;
  color: ${COLORS.secondary};
  pointer-events: none;
  opacity: ${({ $exiting }) => ($exiting ? 0 : 1)};
  transition: opacity 0.45s ease;

  &::selection {
    background-color: ${COLORS.secondary};
    color: ${COLORS.tertiary};
  }
`;
