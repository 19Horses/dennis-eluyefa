import { styled } from 'styled-components';
import { COLORS } from '../../constants';
import { fadeIn } from '../../../styles/animations';

export const AboutContainer = styled.div`
  width: 100%;
  max-width: 100%;
  min-width: 0;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  gap: 0.8rem;
  padding: 0.8rem;
  box-sizing: border-box;
  overflow: hidden;

  @media (max-width: 768px) {
    height: 100%;
    max-height: 100%;
    min-height: 0;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: stretch;
    gap: 0;
    padding: 0;
    overflow-x: hidden;
    overflow-y: auto;
    scroll-snap-type: y mandatory;
    scroll-behavior: auto;
    overscroll-behavior-y: none;
    -webkit-overflow-scrolling: touch;
    touch-action: pan-y;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

export const ClientText = styled.p<{ $delay?: number }>`
  font-family: 'Helvetica Neue Medium', sans-serif;
  font-size: clamp(0.9rem, 1.6vw, 1.2rem);
  color: ${COLORS.tertiary};
  text-align: right;
  font-style: italic;
  margin: 0;
  max-width: 100%;
  overflow-wrap: anywhere;
  transition: color 0.3s ease-in-out;
  animation: ${fadeIn} 0.5s ease-out
    ${({ $delay = 0 }) => $delay * CLIENT_ANIMATION_DELAY_STEP}s both;

  &::selection {
    background-color: ${COLORS.tertiary};
    color: ${COLORS.secondary};
  }

  @media (max-width: 768px) {
    text-align: center;
    font-size: clamp(1.05rem, 4.2vw, 1.35rem);
  }
`;

export const ClientContainer = styled.div`
  flex: 0 1 clamp(180px, 20vw, 260px);
  min-width: 0;
  max-width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-self: flex-end;
  background-color: ${COLORS.secondary};
  box-sizing: border-box;
  padding: 0.8rem 0.8rem 0;
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior: none;
  scrollbar-width: none;
  animation: ${fadeIn} 0.6s ease-out 0.45s both;
  transition: all 0.3s ease-in-out;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 768px) {
    flex: 0 0 100%;
    width: 100%;
    height: 100%;
    min-height: 100%;
    max-height: 100%;
    min-width: 0;
    align-items: center;
    justify-content: center;
    padding: 1.5rem 1.1rem;
    overflow: hidden;
    touch-action: pan-y;
    scroll-snap-align: start;
    scroll-snap-stop: always;
  }

  &:hover {
    background-color: ${COLORS.tertiary};
  }

  &:hover ${ClientText} {
    color: ${COLORS.secondary};

    &::selection {
      background-color: ${COLORS.secondary};
      color: ${COLORS.tertiary};
    }
  }
`;

export const QuoteContainer = styled.div`
  position: relative;
  flex: 1 1 0;
  min-width: 0;
  max-width: 100%;
  align-self: stretch;
  height: auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: stretch;
  background-color: ${COLORS.primary};
  box-sizing: border-box;
  overflow: hidden;
  animation: ${fadeIn} 0.6s ease-out 0.15s both;

  > * {
    flex: 1 1 auto;
    width: 100%;
    height: 100%;
    min-height: 0;
  }

  @media (max-width: 768px) {
    flex: 0 0 100%;
    align-self: auto;
    width: 100%;
    height: 100%;
    min-height: 100%;
    max-height: 100%;
    padding: 1.5rem 1.1rem;
    min-width: 0;
    touch-action: pan-y;
    scroll-snap-align: start;
    scroll-snap-stop: always;
  }
`;

export const ScrollHintArrow = styled.div<{ $visible: boolean }>`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    right: 1.1rem;
    bottom: 1.25rem;
    z-index: 3;
    flex: 0 0 auto;
    width: 2.4rem;
    height: 3.4rem;
    min-height: 0;
    pointer-events: none;
    opacity: ${({ $visible }) => ($visible ? 1 : 0)};
    transition: opacity 0.45s ease;
    color: ${COLORS.secondary};

    svg {
      width: 100%;
      height: 100%;
      display: block;
    }
  }
`;

export const ImageContainer = styled.div`
  flex: 1 1 0;
  min-width: 0;
  max-width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  animation: ${fadeIn} 0.6s ease-out 0.3s both;

  @media (max-width: 768px) {
    flex: 0 0 100%;
    height: 100%;
    min-height: 100%;
    max-height: 100%;
    min-width: 0;
    width: 100%;
    touch-action: pan-y;
    scroll-snap-align: start;
    scroll-snap-stop: always;
  }
`;

export const ImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${COLORS.primary};
  opacity: 0.3;
  z-index: 1;
`;

export const BeAboutImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;

  &::selection {
    background-color: transparent;
  }
`;

export const BioText = styled.p`
  font-family: 'Helvetica Neue Medium', sans-serif;
  font-size: clamp(1.2rem, 1.6vw, 1rem);
  color: ${COLORS.secondary};
  text-align: justify;
  text-justify: inter-word;
  margin: 0;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.8rem;
  line-height: 1.3;
  box-sizing: border-box;
  z-index: 2;

  &::selection {
    background-color: ${COLORS.secondary};
    color: ${COLORS.tertiary};
  }
`;

export const QuoteText = styled.p`
  font-family: 'Helvetica Neue Bold', sans-serif;
  font-size: clamp(2.1rem, 9vw, 7.5rem);
  color: ${COLORS.secondary};
  text-align: center;
  font-weight: bold;
  line-height: 0.86;
  margin: 0;
  max-width: min(12ch, 92%);
  min-width: 0;
  overflow-wrap: break-word;

  &::selection {
    background-color: transparent;
  }

  @media (max-width: 768px) {
    font-size: clamp(2rem, 11vw, 4.2rem);
    line-height: 0.92;
    max-width: 16ch;
  }

  @media (min-width: 1200px) {
    max-width: 10ch;
  }
`;

const CLIENT_ANIMATION_DELAY_STEP = 0.05;

export const ClientHeading = styled(ClientText)`
  text-decoration: underline;
  margin-bottom: 0.8rem;

  @media (max-width: 768px) {
    margin-bottom: 1.1rem;
  }
`;

export const ClientsList = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.35rem;
  overflow: visible;
  padding: 0 0.1rem 0.8rem 0;
  box-sizing: border-box;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    justify-items: center;
    overflow: visible;
    max-height: none;
    padding: 0;
    gap: 0.7rem 0.9rem;
  }

  // no scrollbar
  &::-webkit-scrollbar {
    display: none;
  }

  & {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;
