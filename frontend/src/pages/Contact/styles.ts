import { keyframes, styled } from 'styled-components';
import { COLORS } from '../../constants';
import { fadeIn } from '../../../styles/animations';

const backgroundFadeFromBlack = keyframes`
  from {
    background-color: #000000;
  }
  to {
    background-color: ${COLORS.tertiary};
  }
`;

export const ContactContainer = styled.div`
  width: 100%;
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-between;
  background-color: ${COLORS.tertiary};
  padding: 2rem;
  overflow: hidden;
  animation: ${backgroundFadeFromBlack} 0.8s ease-out forwards;

  @media (max-width: 768px) {
    padding: clamp(1rem, 4vw, 1.5rem);
    gap: 1rem;
  }
`;

export const ContactText = styled.p`
  font-family: 'Helvetica Neue Bold', sans-serif;
  font-size: clamp(1.6rem, 5vw, 35px);
  color: ${COLORS.secondary};
  font-weight: bold;
  text-align: center;
  font-style: italic;
  margin: 0;
  animation: ${fadeIn} 0.6s ease-out 0.3s both;

  &::selection {
    background-color: ${COLORS.secondary};
    color: ${COLORS.tertiary};
  }
`;

export const ContactSubtext = styled.p`
  font-family: 'Helvetica Neue Bold', sans-serif;
  font-size: clamp(1rem, 3.2vw, 20px);
  color: ${COLORS.secondary};
  font-weight: bold;
  text-align: center;
  font-style: italic;
  width: 100%;
  margin: 0;

  &::selection {
    background-color: ${COLORS.secondary};
    color: ${COLORS.tertiary};
  }
`;

export const LeftSubtext = styled(ContactSubtext)`
  text-align: left;
  align-self: flex-start;
  animation: ${fadeIn} 0.6s ease-out 0.15s both;

  @media (max-width: 768px) {
    text-align: center;
    align-self: center;
  }
`;

export const RightSubtext = styled(ContactSubtext)`
  text-align: right;
  align-self: flex-end;
  animation: ${fadeIn} 0.6s ease-out 0.45s both;

  @media (max-width: 768px) {
    text-align: center;
    align-self: center;
  }
`;

export const Email = styled.span`
  color: ${COLORS.primary};
  font-weight: bold;
  text-decoration: underline;

  &::selection {
    background-color: ${COLORS.primary};
    color: ${COLORS.secondary};
  }
`;

export const Underline = styled.span`
  text-decoration: underline;
`;
