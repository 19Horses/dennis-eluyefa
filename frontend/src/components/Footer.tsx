import { styled } from 'styled-components';
import { fadeIn } from '../../styles/animations';
import { COLORS } from '../constants';

const FooterContainer = styled.footer`
  width: 100%;
  height: 10%;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  flex-shrink: 0;
  animation: ${fadeIn} 0.6s ease-out;
`;

const SocialLinks = styled.div`
  position: absolute;
  left: 2rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SocialLink = styled.a`
  font-family: 'Helvetica Neue', sans-serif;
  color: black;
  text-decoration: none;
  font-size: 1.2rem;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.6;
  }

  &::selection {
    background-color: ${COLORS.primary};
    color: ${COLORS.secondary};
  }
`;

const Separator = styled.span`
  color: black;
  font-size: 1.2rem;

  &::selection {
    background-color: ${COLORS.primary};
    color: ${COLORS.secondary};
  }
`;

const Copyright = styled.p`
  font-family: 'Helvetica Neue Bold', sans-serif;
  font-size: 1.2rem;
  color: black;
  font-weight: bold;
  margin: 0;

  &::selection {
    background-color: ${COLORS.primary};
    color: ${COLORS.secondary};
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <SocialLinks>
        <SocialLink
          href="https://www.instagram.com/denden_man/"
          target="_blank"
          rel="noopener noreferrer"
        >
          instagram
        </SocialLink>
        <Separator>|</Separator>
        <SocialLink
          href="https://www.tiktok.com/@denden_man"
          target="_blank"
          rel="noopener noreferrer"
        >
          tiktok
        </SocialLink>
      </SocialLinks>
      <Copyright>
        © Dennis Eluyefa {new Date().getFullYear()}. All rights reserved.
      </Copyright>
    </FooterContainer>
  );
};

export default Footer;
