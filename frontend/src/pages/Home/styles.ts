import { styled } from 'styled-components';
import { COLORS } from '../../constants';
import { fadeIn } from '../../../styles/animations';

export const HomeContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  position: relative;
  padding: 2rem;
`;

export const HomeImage = styled.img<{ $isActive: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: calc(100% - 16px);
  height: calc(100% - 16px);
  inset: 8px;
  object-fit: cover;
  z-index: 0;
  opacity: ${({ $isActive }) => ($isActive ? 1 : 0)};
  transition: opacity 1000ms ease;
  pointer-events: none;

  &::selection {
    background-color: transparent;
    color: ${COLORS.secondary};
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const ImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${COLORS.primary};
  opacity: 0.15;
  z-index: 1;
  cursor: none;
`;

export const HomeTitle = styled.p`
  font-family: 'Helvetica Neue Medium', sans-serif;
  font-size: clamp(1.125rem, 2.4vw, 1.75rem);
  line-height: 1.1;
  color: ${COLORS.secondary};
  z-index: 2;
  text-align: left;
  transition: all 1s ease;

  animation: ${fadeIn} 1s ease both;

  &::selection {
    background-color: ${COLORS.secondary};
    color: ${COLORS.tertiary};
  }
`;
