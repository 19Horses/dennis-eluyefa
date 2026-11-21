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

export const GalleryScroller = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  background-color: ${COLORS.primary};
  box-sizing: border-box;

  @media (max-width: 768px) {
    overflow-x: hidden;
    overflow-y: auto;
    overscroll-behavior-y: contain;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    /* Scroll empty space; images keep touch-action: none for drag/pinch */
    touch-action: pan-y;

    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

export const GalleryContainer = styled.div`
  position: relative;
  /* Keep scatter z-index inside this context so images stay under mobile menu (z 20/30) */
  z-index: 0;
  isolation: isolate;
  width: 100%;
  height: 100%;
  min-height: 0;
  /* Match WorkContainer inset */
  padding: 0.5rem;
  box-sizing: border-box;
  overflow: hidden;
  background-color: ${COLORS.primary};
  touch-action: none;
  user-select: none;

  @media (max-width: 1024px) {
    padding: 0.6rem;
  }

  @media (max-width: 768px) {
    /* Taller canvas so the page can scroll a bit on mobile */
    height: 155%;
    min-height: 155%;
    padding: 0.4rem;
    overflow: visible;
    touch-action: pan-y;
  }
`;

export const ScatterImage = styled.img<{
  $delay: number;
  $width: number;
  $dragging: boolean;
}>`
  position: absolute;
  width: ${({ $width }) => $width}px;
  height: auto;
  max-width: min(90vw, 380px);
  display: block;
  cursor: ${({ $dragging }) => ($dragging ? 'grabbing' : 'grab')};
  opacity: 0;
  animation: ${scatterFadeIn} 0.7s ease forwards;
  animation-delay: ${({ $delay }) => $delay}s;
  /* z-index set inline from last-touched order */
  z-index: 1;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.35);
  pointer-events: auto;
  -webkit-user-drag: none;
  touch-action: none;

  &::selection {
    background-color: transparent;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    opacity: 1;
  }
`;

export const DecelToggle = styled.button<{ $on: boolean }>`
  position: absolute;
  left: 0.5rem;
  bottom: 0.5rem;
  /* High within gallery only — isolation keeps this under the mobile menu */
  z-index: 999;
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  margin: 0;
  padding: 0.45rem 0.65rem;
  border: 0;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.55);
  color: ${COLORS.secondary};
  font-family: 'Helvetica Neue Bold', sans-serif;
  font-size: 0.75rem;
  font-weight: bold;
  letter-spacing: 0.04em;
  text-transform: lowercase;
  cursor: pointer;
  pointer-events: auto;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.45);

  @media (max-width: 768px) {
    position: sticky;
    bottom: 0.5rem;
    left: 0.5rem;
    /* Sit over the tall canvas while remaining sticky in the scroller */
    margin-top: -2.5rem;
  }

  &:focus-visible {
    outline: 2px solid ${COLORS.tertiary};
    outline-offset: 2px;
  }
`;

export const DecelTrack = styled.span<{ $on: boolean }>`
  position: relative;
  width: 2.4rem;
  height: 1.25rem;
  border-radius: 999px;
  background: ${({ $on }) =>
    $on ? COLORS.tertiary : 'rgba(255, 255, 255, 0.28)'};
  transition: background 0.2s ease;
  flex-shrink: 0;

  &::after {
    content: '';
    position: absolute;
    top: 0.15rem;
    left: ${({ $on }) => ($on ? '1.25rem' : '0.15rem')};
    width: 0.95rem;
    height: 0.95rem;
    border-radius: 50%;
    background: ${COLORS.secondary};
    transition: left 0.2s ease;
  }
`;
