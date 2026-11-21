import { Link, useLocation } from 'react-router';
import { styled } from 'styled-components';
import { fadeIn } from '../../styles/animations';
import { COLORS } from '../constants';

type FooterProps = {
  isMobileNav?: boolean;
  attached?: boolean;
};

const FooterContainer = styled.footer<{
  $isMobileNav: boolean;
  $attached: boolean;
}>`
  width: 100%;
  height: ${({ $isMobileNav }) => ($isMobileNav ? 'auto' : '10dvh')};
  min-height: ${({ $isMobileNav }) => ($isMobileNav ? '0' : '10dvh')};
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
  scroll-snap-align: ${({ $isMobileNav, $attached }) =>
    $isMobileNav || $attached ? 'none' : 'end'};
  scroll-snap-stop: ${({ $isMobileNav, $attached }) =>
    $isMobileNav || $attached ? 'normal' : 'always'};

  @media (max-width: 768px) {
    display: ${({ $isMobileNav }) => ($isMobileNav ? 'flex' : 'none')};
    flex-direction: column;
    min-height: 0;
  }
`;

const LinksRow = styled.div<{ $isMobileNav: boolean }>`
  display: ${({ $isMobileNav }) => ($isMobileNav ? 'flex' : 'contents')};
  flex-direction: ${({ $isMobileNav }) => ($isMobileNav ? 'column' : 'row')};
  width: ${({ $isMobileNav }) => ($isMobileNav ? '100%' : 'auto')};
  align-items: center;
  justify-content: ${({ $isMobileNav }) =>
    $isMobileNav ? 'center' : 'space-between'};
  gap: ${({ $isMobileNav }) => ($isMobileNav ? '0.65rem' : '1rem')};
  box-sizing: border-box;
  padding: ${({ $isMobileNav }) => ($isMobileNav ? '0 1.25rem' : '0')};
`;

const SocialLinks = styled.div<{ $isMobileNav: boolean }>`
  position: ${({ $isMobileNav }) => ($isMobileNav ? 'static' : 'absolute')};
  left: ${({ $isMobileNav }) => ($isMobileNav ? 'auto' : '2rem')};
  top: ${({ $isMobileNav }) => ($isMobileNav ? 'auto' : '50%')};
  transform: ${({ $isMobileNav }) =>
    $isMobileNav ? 'none' : 'translateY(-50%)'};
  display: flex;
  align-items: center;
  justify-content: ${({ $isMobileNav }) =>
    $isMobileNav ? 'center' : 'flex-start'};
  gap: 0.5rem;
`;

const SocialLink = styled.a`
  font-family: 'Helvetica Neue', sans-serif;
  color: inherit;
  text-decoration: none;
  font-size: 1.2rem;
  line-height: 1.2;
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
  line-height: 1.2;

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
  box-sizing: border-box;
  width: ${({ $isMobileNav }) => ($isMobileNav ? '100%' : 'auto')};
  padding: ${({ $isMobileNav }) => ($isMobileNav ? '0 1.25rem' : '0')};

  &::selection {
    background-color: ${COLORS.primary};
    color: ${COLORS.secondary};
  }
`;

const GalleryLink = styled(Link)<{
  $isMobileNav: boolean;
  $isActive: boolean;
}>`
  position: ${({ $isMobileNav }) => ($isMobileNav ? 'static' : 'absolute')};
  right: ${({ $isMobileNav }) => ($isMobileNav ? 'auto' : '2rem')};
  top: ${({ $isMobileNav }) => ($isMobileNav ? 'auto' : '50%')};
  transform: ${({ $isMobileNav }) =>
    $isMobileNav ? 'none' : 'translateY(-50%)'};
  font-family: 'Helvetica Neue', sans-serif;
  color: ${({ $isActive }) => ($isActive ? COLORS.tertiary : 'inherit')};
  text-decoration: none;
  font-size: 1.2rem;
  line-height: 1.2;
  cursor: pointer;
  transition: opacity 0.2s ease, color 0.2s ease;
  margin-left: 0;
  text-align: ${({ $isMobileNav }) => ($isMobileNav ? 'center' : 'right')};
  flex-shrink: 0;

  &:hover {
    opacity: 0.6;
  }

  &::selection {
    background-color: ${COLORS.primary};
    color: ${COLORS.secondary};
  }
`;

const Footer = ({ isMobileNav = false, attached = false }: FooterProps) => {
  const location = useLocation();
  const isGallery = location.pathname === '/gallery';

  return (
    <FooterContainer $isMobileNav={isMobileNav} $attached={attached}>
      <LinksRow $isMobileNav={isMobileNav}>
        <GalleryLink
          to="/gallery"
          $isMobileNav={isMobileNav}
          $isActive={isGallery}
        >
          gallery
        </GalleryLink>
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
      </LinksRow>
      <Copyright $isMobileNav={isMobileNav}>
        © Dennis Eluyefa {new Date().getFullYear()}. All rights reserved.
      </Copyright>
    </FooterContainer>
  );
};

export default Footer;
