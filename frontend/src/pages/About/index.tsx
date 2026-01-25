import Layout from '../../components/Layout';
import { useGetClients } from '../../queries/useGetClients';
import { Loading } from '../../components/Loading';
import {
  AboutContainer,
  ClientContainer,
  ClientHeading,
  ClientsList,
  ClientText,
  QuoteContainer,
  QuoteText,
} from './styles';

function About() {
  const { data, isLoading, isError } = useGetClients();

  if (isLoading) {
    return <Loading />;
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
          <ClientHeading>select clients</ClientHeading>
          <ClientsList>
            {data?.map((client) => (
              <ClientText key={client}>{client}</ClientText>
            ))}
          </ClientsList>
        </ClientContainer>
      </AboutContainer>
    </Layout>
  );
}

export default About;
