import type { ReactNode } from 'react';
import { Loading } from '../../components/Loading';
import { useGetContact } from '../../queries/useGetContact';
import {
  ContactContainer,
  ContactText,
  Email,
  LeftSubtext,
  RightSubtext,
  Underline,
} from './styles';

const FALLBACK = {
  email: 'studio@denniseluyefa.com',
  printEmail: 'prints@denniseluyefa.com',
  inquiriesText:
    'for all **business**, **commission**, **collaborative**, or otherwise **professional** inquiries, please email:',
  thanksMessage: 'THANKS FOR STOPPING BY :)',
  printText:
    'if there are images on this website you wish to purchase as a **print**, please contact: {{email}} with your specifications.',
};

/** Renders CMS copy; `**word**` becomes underlined, `{{email}}` becomes the email link. */
function renderMarkedText(text: string, email: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const pattern = /(\{\{email\}\}|\*\*[^*]+\*\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];
    if (token === '{{email}}') {
      parts.push(<Email key={`email-${key++}`}>{email}</Email>);
    } else {
      parts.push(
        <Underline key={`em-${key++}`}>{token.slice(2, -2)}</Underline>
      );
    }

    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

function Contact() {
  const { data, isLoading, isError } = useGetContact();

  if (isLoading) {
    return <Loading />;
  }

  const email = data?.email || FALLBACK.email;
  const printEmail = data?.printEmail || FALLBACK.printEmail;
  const inquiriesText = data?.inquiriesText || FALLBACK.inquiriesText;
  const thanksMessage = data?.thanksMessage || FALLBACK.thanksMessage;
  const printText = data?.printText || FALLBACK.printText;

  if (isError && !data) {
    // Fall back to hardcoded copy if the document is missing / unreachable.
  }

  const inquiriesHasEmail = inquiriesText.includes('{{email}}');
  const printHasEmail = printText.includes('{{email}}');

  return (
    <ContactContainer>
      <LeftSubtext>
        {renderMarkedText(inquiriesText, email)}
        {!inquiriesHasEmail ? (
          <>
            {' '}
            <Email>{email}</Email>
          </>
        ) : null}
      </LeftSubtext>
      <ContactText>{thanksMessage}</ContactText>
      <RightSubtext>
        {renderMarkedText(printText, printEmail)}
        {!printHasEmail ? (
          <>
            {' '}
            <Email>{printEmail}</Email>
          </>
        ) : null}
      </RightSubtext>
    </ContactContainer>
  );
}

export default Contact;
