import { styled } from 'styled-components';
import { COLORS } from '../../constants';
import { fadeIn } from '../../../styles/animations';

export const ProjectContainer = styled.div`
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  padding: 0;
  position: relative;
  box-sizing: border-box;
  background-color: ${COLORS.primary};

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
  }
`;

export const DesktopScroller = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  gap: 0.45rem;
  width: 100%;
  height: 100%;
  padding: 0.75rem;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-behavior: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-x: contain;
  scrollbar-width: none;
  box-sizing: border-box;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const DesktopSlide = styled.div<{ $index: number; $reveal: boolean }>`
  flex: 0 0 auto;
  height: 100%;
  max-width: none;
  display: flex;
  align-items: stretch;
  opacity: 0;
  animation: ${({ $reveal }) => ($reveal ? fadeIn : 'none')};
  animation-duration: 0.65s;
  animation-timing-function: ease;
  animation-fill-mode: forwards;
  animation-delay: ${({ $reveal, $index }) =>
    $reveal ? `${$index * 0.1}s` : '0s'};

  @media (prefers-reduced-motion: reduce) {
    opacity: ${({ $reveal }) => ($reveal ? 1 : 0)};
    animation: none;
  }
`;

export const DesktopSlideImage = styled.img`
  height: 100%;
  width: auto;
  max-width: none;
  display: block;
  user-select: none;
  -webkit-user-drag: none;

  &::selection {
    background-color: transparent;
  }
`;

export const ProjectMeta = styled.div`
  flex-shrink: 0;
  align-self: flex-start;
  padding: 1rem 1.5rem;
  box-sizing: border-box;
  text-align: right;

  @media (max-width: 768px) {
    padding: 1rem;
    text-align: center;
    width: 100%;
  }
`;

export const ProjectTitle = styled.h1`
  font-family: 'Helvetica Neue Bold', sans-serif;
  font-size: 2rem;
  font-weight: bold;
  color: ${COLORS.secondary};
  margin: 0 0 0.25rem 0;

  &::selection {
    background-color: ${COLORS.secondary};
    color: ${COLORS.tertiary};
  }
`;

export const ProjectDate = styled.p`
  font-family: 'Helvetica Neue Bold', sans-serif;
  font-size: 1.25rem;
  font-weight: bold;
  color: ${COLORS.secondary};
  margin: 0;

  &::selection {
    background-color: ${COLORS.secondary};
    color: ${COLORS.tertiary};
  }
`;

export const MobileGallery = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 0;
  background-color: ${COLORS.primary};
`;

export const MobileScroller = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-x: contain;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const MobileSlide = styled.div<{ $index: number; $reveal: boolean }>`
  flex: 0 0 100%;
  width: 100%;
  height: 100%;
  scroll-snap-align: center;
  scroll-snap-stop: always;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding: 3.5rem 1rem 3.5rem;
  opacity: 0;
  animation: ${({ $reveal }) => ($reveal ? fadeIn : 'none')};
  animation-duration: 0.65s;
  animation-timing-function: ease;
  animation-fill-mode: forwards;
  animation-delay: ${({ $reveal, $index }) =>
    $reveal ? `${$index * 0.1}s` : '0s'};

  @media (prefers-reduced-motion: reduce) {
    opacity: ${({ $reveal }) => ($reveal ? 1 : 0)};
    animation: none;
  }
`;

export const MobileSlideImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  display: block;
  user-select: none;
  -webkit-user-drag: none;
`;

export const MobileCloseButton = styled.button`
  position: absolute;
  top: 0.85rem;
  right: 0.85rem;
  z-index: 2;
  width: 2.5rem;
  height: 2.5rem;
  border: 0;
  padding: 0;
  background: transparent;
  color: ${COLORS.secondary};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:focus-visible {
    outline: 1px solid ${COLORS.secondary};
    outline-offset: 2px;
  }
`;

export const MobileCloseIcon = styled.span`
  position: relative;
  width: 1.35rem;
  height: 1.35rem;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: currentColor;
  }

  &::before {
    transform: translateY(-50%) rotate(45deg);
  }

  &::after {
    transform: translateY(-50%) rotate(-45deg);
  }
`;

export const MobileCounter = styled.p`
  position: absolute;
  right: 1rem;
  bottom: 1rem;
  z-index: 2;
  margin: 0;
  font-family: 'Helvetica Neue Bold', sans-serif;
  font-size: 0.95rem;
  font-weight: bold;
  letter-spacing: 0.02em;
  color: ${COLORS.secondary};
  pointer-events: none;

  &::selection {
    background-color: ${COLORS.secondary};
    color: ${COLORS.tertiary};
  }
`;
