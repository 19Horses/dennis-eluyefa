import { styled } from 'styled-components';
import { COLORS } from '../../constants';

export const AboutContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  gap: 0.8rem;
  padding: 0.8rem;
  box-sizing: border-box;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 0.8rem 0.6rem;
  }
`;

export const ClientContainer = styled.div`
  flex: 0 0 clamp(180px, 20vw, 260px);
  width: auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-self: flex-end;
  background-color: ${COLORS.secondary};
  box-sizing: border-box;
  padding: 0.8rem;
  overflow-y: scroll;

  @media (max-width: 768px) {
    flex: 0 0 auto;
    width: 100%;
    align-items: center;
    padding: 0.9rem 0.8rem;
  }
`;

export const QuoteContainer = styled.div`
  flex: 1 1 0;
  width: auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${COLORS.primary};
  padding: 1rem;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 1.2rem 1rem;
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

export const ClientText = styled.p`
  font-family: 'Helvetica Neue Medium', sans-serif;
  font-size: clamp(0.9rem, 1.6vw, 1.2rem);
  color: ${COLORS.tertiary};
  text-align: right;
  font-style: italic;
  margin: 0;
  max-width: 100%;
  overflow-wrap: anywhere;

  &::selection {
    background-color: ${COLORS.tertiary};
    color: ${COLORS.secondary};
  }

  @media (max-width: 768px) {
    text-align: center;
  }
`;

export const ClientHeading = styled(ClientText)`
  text-decoration: underline;
  margin-bottom: 0.8rem;
`;

export const ClientsList = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.35rem;
  overflow: auto;
  padding-right: 0.1rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    justify-items: center;
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


