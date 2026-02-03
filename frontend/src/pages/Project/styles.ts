import { styled } from 'styled-components';
import { COLORS } from '../../constants';
import { fadeIn } from '../../../styles/animations';

export const ProjectContainer = styled.div`
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  position: relative;
  animation: ${fadeIn} 0.5s ease forwards;
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
