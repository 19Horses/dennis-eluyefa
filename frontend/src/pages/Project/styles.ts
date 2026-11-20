import { styled } from 'styled-components';
import { COLORS } from '../../constants';
import { fadeIn } from '../../../styles/animations';

export const ProjectContainer = styled.div`
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  padding: 0.5rem;
  position: relative;
  animation: ${fadeIn} 0.5s ease forwards;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 0;
    display: flex;
    flex-direction: column;
  }
`;

export const SliderViewport = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

export const SliderTrack = styled.div<{ $count: number }>`
  display: flex;
  flex-direction: row;
  height: 100%;
  width: ${(p) => p.$count * 100}%;
  transition: transform 0.4s ease;
`;

export const Slide = styled.div<{ $count: number }>`
  flex: 0 0 ${(p) => 100 / p.$count}%;
  height: 100%;
  min-width: 0;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  background-color: ${COLORS.primary};
`;

export const SlideImageContainer = styled.div`
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
`;

export const SlideImage = styled.img`
  height: 100%;
  width: auto;
  max-width: 100%;
  object-fit: contain;
  display: block;
`;

export const ProjectMeta = styled.div`
  flex-shrink: 0;
  align-self: flex-start;
  padding: 1rem 1.5rem;
  box-sizing: border-box;
  text-align: right;
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

export const ClickZone = styled.button`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 50%;
  border: none;
  background: transparent;
  z-index: 1;
  padding: 0;

  &:focus {
    outline: none;
  }
`;

export const ClickZoneLeft = styled(ClickZone)`
  left: 0;
  cursor: w-resize;
`;

export const ClickZoneRight = styled(ClickZone)`
  right: 0;
  cursor: e-resize;
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

export const MobileSlide = styled.div`
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
