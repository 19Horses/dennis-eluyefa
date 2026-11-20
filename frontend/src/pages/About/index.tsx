import { useGetAbout } from '../../queries/useGetAbout';
import { useGetClients } from '../../queries/useGetClients';
import { Loading } from '../../components/Loading';
import { AnimatedQuote } from '../../components/AnimatedQuote';
import { useIsMobile } from '../../hooks/useIsMobile';
import {
  buildSanityImageSrcSet,
  getSanityImageUrl,
  IMAGE_WIDTHS,
} from '../../sanityImage';
import {
  AboutContainer,
  BeAboutImage,
  BioText,
  ClientContainer,
  ClientHeading,
  ClientsList,
  ClientText,
  ImageContainer,
  ImageOverlay,
  QuoteContainer,
} from './styles';

const ABOUT_IMAGE_OPTIONS = { width: IMAGE_WIDTHS.about };

function About() {
  const isMobile = useIsMobile();
  const {
    data: aboutData,
    isLoading: aboutIsLoading,
    isError: aboutIsError,
  } = useGetAbout();
  const { data, isLoading, isError } = useGetClients();

  if (aboutIsLoading || isLoading) {
    return <Loading />;
  }

  const quoteText =
    aboutData?.quote ?? 'i just want to create images full of life.';

  return (
    <AboutContainer>
      <QuoteContainer>
        <AnimatedQuote
          key={isMobile ? 'mono' : 'color'}
          monochrome={isMobile}
          quote={`“${quoteText}”`}
        />
      </QuoteContainer>
      {!aboutIsError && (
        <ImageContainer>
          <BeAboutImage
            src={getSanityImageUrl(aboutData?.image, ABOUT_IMAGE_OPTIONS)}
            srcSet={buildSanityImageSrcSet(
              aboutData?.image,
              ABOUT_IMAGE_OPTIONS
            )}
            alt="About"
          />
          <ImageOverlay />
          <BioText>{aboutData?.bio}</BioText>
        </ImageContainer>
      )}
      {!isError && (
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
      )}
    </AboutContainer>
  );
}

export default About;
