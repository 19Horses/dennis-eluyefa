import Layout from '../components/Layout';
import { useGetClients } from '../queries/useGetClients';
import { Loading } from '../components/Loading';
import { styled } from 'styled-components';
import { COLORS } from '../constants';

const AboutContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  padding: 0.8rem;
`;

const ClientContainer = styled.div`
  width: 15%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-self: flex-end;
  background-color: ${COLORS.secondary};
  padding: 0.8rem;
`;

const QuoteContainer = styled.div`
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${COLORS.primary};
`;

const QuoteText = styled.p`
  font-family: 'Helvetica Neue Bold', sans-serif;
  font-size: clamp(2.5rem, 17vw, 10rem);
  color: ${COLORS.secondary};
  text-align: center;
  font-weight: bold;
  line-height: 0.7765;
  margin: 0;
  max-width: 80%;

  &::selection {
    background-color: transparent;
  }
`;

const ClientText = styled.p`
  font-family: 'Helvetica Neue Medium', sans-serif;
  font-size: clamp(0.8rem, 2.4vw, 1.2rem);
  color: ${COLORS.tertiary};
  text-align: center;
  font-style: italic;
  margin: 0;

  &::selection {
    background-color: ${COLORS.tertiary};
    color: ${COLORS.secondary};
  }
`;

function About() {
  const { data, isLoading, isError } = useGetClients();

  if (isLoading) {
    return <Loading />
  }

  if (isError) {
    return <p>Error!</p>;
  }

  return (
    <Layout>
      <AboutContainer>
        <QuoteContainer>
          <QuoteText>“i just want to create images full of life.”</QuoteText>
        </QuoteContainer>
        <ClientContainer>
          <ClientText style={{ textDecoration: 'underline', marginBottom: '0.8rem' }}>select clients</ClientText>
          {data?.map((client) => (
            <ClientText key={client}>{client}</ClientText>
          ))}
        </ClientContainer>
      </AboutContainer>
    </Layout >
  );
}

export default About;
