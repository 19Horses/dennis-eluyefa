import Layout from '../../components/Layout';
import { useGetTest } from '../../queries/useGetTests';
import {
  ContactContainer,
  LeftSubtext,
  Underline,
  Email,
  ContactText,
  RightSubtext,
} from './styles';

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
