import {
  ContactContainer,
  ContactText,
  Email,
  LeftSubtext,
  RightSubtext,
  Underline,
} from './styles';

const EMAIL = 'contact@denniseluyefa.com';

function Contact() {
  return (
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
  );
}

export default Contact;
