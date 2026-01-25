import { COLORS } from '../constants';
import Layout from './Layout';
import { styled } from 'styled-components';

const LoadingText = styled.p`
  font-family: 'Helvetica Neue Medium', sans-serif;
  font-size: clamp(0.8rem, 2.4vw, 1.2rem);
  color: ${COLORS.secondary};
  text-align: center;
  font-style: italic;

  &::selection {
    background-color: ${COLORS.secondary};
    color: ${COLORS.primary};
  }
`;

export const Loading = () => {
  return (
    <Layout>
      <LoadingText>loading...</LoadingText>
    </Layout>
  );
};
