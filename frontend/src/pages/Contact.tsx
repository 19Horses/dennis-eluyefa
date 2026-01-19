import Layout from '../components/Layout';
import { COLORS } from '../constants';
import { useGetTest } from '../queries/useGetTests';
import { styled } from 'styled-components';

const ContactContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-between;
  background-color: ${COLORS.tertiary};
  padding: 2rem;
`;

const ContactText = styled.p`
  font-family: 'Helvetica Neue Bold', sans-serif;
  font-size: 35px;
  color: ${COLORS.secondary};
  font-weight: bold;
  text-align: center;
  font-style: italic;

  &::selection {
    background-color: ${COLORS.secondary};
    color: ${COLORS.tertiary};
  }
`;

const ContactSubtext = styled.p`
  font-family: 'Helvetica Neue Bold', sans-serif;
  font-size: 20px;
  color: ${COLORS.secondary};
  font-weight: bold;
  text-align: center;
  font-style: italic;
  width: 100%;

  &::selection {
    background-color: ${COLORS.secondary};
    color: ${COLORS.tertiary};
  }
`;

const LeftSubtext = styled(ContactSubtext)`
  text-align: left;
  align-self: flex-start;

  @media (max-width: 768px) {
    text-align: center;
    align-self: center;
  }
`;

const RightSubtext = styled(ContactSubtext)`
  text-align: right;
  align-self: flex-end;

  @media (max-width: 768px) {
    text-align: center;
    align-self: center;
  }
`;

const Email = styled.span`
  color: ${COLORS.primary};
  font-weight: bold;
  text-decoration: underline;

  &::selection {
    background-color: ${COLORS.primary};
    color: ${COLORS.secondary};
  }
`;

const Underline = styled.span`
  text-decoration: underline;
`;

const EMAIL = 'contact@denniseluyefa.com';

function Contact() {
  const { data, isLoading, isError } = useGetTest();

  console.log(data);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error!</p>;
  }

  return (
    <Layout>
      <ContactContainer>
        <LeftSubtext>
          for all <Underline>business</Underline>,{' '}
          <Underline>commission</Underline>,{' '}
          <Underline>collaborative</Underline>, or otherwise{' '}
          <Underline>professional</Underline> inquiries, please email:{' '}
          <Email>{EMAIL}</Email>
        </LeftSubtext>
        <ContactText>THANKS FOR STOPPING BY:)</ContactText>
        <RightSubtext>
          if there are images on this website you wish to purchase as a{' '}
          <Underline>print</Underline>, please contact: <Email>{EMAIL}</Email>{' '}
          with your specifications.
        </RightSubtext>
      </ContactContainer>
    </Layout>
  );
}

export default Contact;
