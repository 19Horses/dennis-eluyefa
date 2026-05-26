import { styled } from 'styled-components';
import { fadeIn } from '../../styles/animations';
import { COLORS } from '../constants';

type FooterProps = {
  isMobileNav?: boolean;
};

const FooterContainer = styled.footer<{ $isMobileNav: boolean }>`
  width: 100%;
  height: ${({ $isMobileNav }) => ($isMobileNav ? 'auto' : '10%')};
  background-color: ${({ $isMobileNav }) =>
    $isMobileNav ? COLORS.primary : COLORS.secondary};
  color: ${({ $isMobileNav }) =>
    $isMobileNav ? COLORS.secondary : COLORS.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  position: ${({ $isMobileNav }) => ($isMobileNav ? 'static' : 'relative')};
  flex-shrink: 0;
  animation: ${fadeIn} 0.6s ease-out;
  box-sizing: border-box;
  padding: ${({ $isMobileNav }) => ($isMobileNav ? '1rem 0 0' : '0')};
  gap: ${({ $isMobileNav }) => ($isMobileNav ? '0.8rem' : '0')};

  @media (max-width: 768px) {
    display: ${({ $isMobileNav }) => ($isMobileNav ? 'flex' : 'none')};
    flex-direction: column;
  }
`;

const SocialLinks = styled.div<{ $isMobileNav: boolean }>`
  position: ${({ $isMobileNav }) => ($isMobileNav ? 'static' : 'absolute')};
  left: ${({ $isMobileNav }) => ($isMobileNav ? 'auto' : '2rem')};
  top: ${({ $isMobileNav }) => ($isMobileNav ? 'auto' : '50%')};
  transform: ${({ $isMobileNav }) =>
    $isMobileNav ? 'none' : 'translateY(-50%)'};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SocialLink = styled.a`
  font-family: 'Helvetica Neue', sans-serif;
  color: inherit;
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
  color: inherit;
  font-size: 1.2rem;

  &::selection {
    background-color: ${COLORS.primary};
    color: ${COLORS.secondary};
  }
`;

const Copyright = styled.p<{ $isMobileNav: boolean }>`
  font-family: 'Helvetica Neue Bold', sans-serif;
  font-size: ${({ $isMobileNav }) => ($isMobileNav ? '0.75rem' : '1.2rem')};
  color: inherit;
  font-weight: bold;
  margin: 0;
  text-align: center;

  &::selection {
    background-color: ${COLORS.primary};
    color: ${COLORS.secondary};
  }
`;

const Footer = ({ isMobileNav = false }: FooterProps) => {
  return (
    <FooterContainer $isMobileNav={isMobileNav}>
      <SocialLinks $isMobileNav={isMobileNav}>
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
      <Copyright $isMobileNav={isMobileNav}>
        © Dennis Eluyefa {new Date().getFullYear()}. All rights reserved.
      </Copyright>
    </FooterContainer>
  );
};

export default Footer;
