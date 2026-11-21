import { styled } from 'styled-components';
import { COLORS } from '../constants';

const LoadingWrap = styled.div`
  width: 100%;
  height: 100%;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
`;

const LoadingText = styled.p`
  font-family: 'Helvetica Neue Medium', sans-serif;
  font-size: clamp(0.8rem, 2.4vw, 1.2rem);
  color: ${COLORS.secondary};
  text-align: center;
  font-style: italic;
  margin: 0;

  &::selection {
    background-color: ${COLORS.secondary};
    color: ${COLORS.primary};
  }
`;

export const Loading = () => {
  return (
    <LoadingWrap role="status" aria-live="polite" aria-label="Loading">
      <LoadingText>loading...</LoadingText>
    </LoadingWrap>
  );
};
