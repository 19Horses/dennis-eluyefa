import { useGetAbout } from '../../queries/useGetAbout';
import { useGetClients } from '../../queries/useGetClients';
import { Loading } from '../../components/Loading';
import {
  AboutContainer,
  BeAboutImage,
  BioText,
  ClientContainer,
  ClientHeading,
  ClientsList,
  ClientText,
  ImageContainer,
  QuoteContainer,
  QuoteText,
} from './styles';

function About() {
  const {
    data: aboutData,
    isLoading: aboutIsLoading,
    isError: aboutIsError,
  } = useGetAbout();
  const { data, isLoading, isError } = useGetClients();

  if (isLoading || aboutIsLoading) {
    return <Loading />;
  }
  if (isError || aboutIsError) {
    return <p>Error!</p>;
  }
  return (
    <AboutContainer>
      <QuoteContainer>
        {aboutData?.quote ? (
          <QuoteText>“{aboutData.quote}”</QuoteText>
        ) : (
          <QuoteText>“i just want to create images full of life.”</QuoteText>
        )}
      </QuoteContainer>
      <ImageContainer>
        <BeAboutImage src={aboutData?.image?.asset?.url} alt="About" />
        <BioText>{aboutData?.bio}</BioText>
      </ImageContainer>
      <ClientContainer>
        <ClientHeading>select clients</ClientHeading>
        <ClientsList>
          {data?.map((client, index) => (
            <ClientText key={client} $delay={index}>
              {client}
            </ClientText>
          ))}
        </ClientsList>
      </ClientContainer>
    </AboutContainer>
  );
}

export default About;
