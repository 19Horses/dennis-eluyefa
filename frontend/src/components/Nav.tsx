import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { styled } from 'styled-components';
import { COLORS } from '../constants';
import { fadeIn, fadeInPreserveOpacity } from '../../styles/animations';
import logo from '../assets/logo.png';

const NavContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  padding: clamp(0.5rem, 1.5vw, 0.2rem) clamp(0.75rem, 3vw, 1.5rem);
  padding-left: 0;
  width: 100%;
  height: 10%;
  min-height: 10%;
  max-height: 10%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    gap: 0.6rem;
    position: relative;
    z-index: 20;
  }
`;

const STAGGER_DELAY = 0.1;

const NavLink = styled(Link)<{
  $isActive: boolean;
  $isProject?: boolean;
  $index?: number;
}>`
  font-family: 'Helvetica Neue Bold', sans-serif;
  text-decoration: none;
  color: ${({ $isProject }) => ($isProject ? COLORS.tertiary : COLORS.primary)};
  font-weight: bold;
  opacity: ${({ $isActive }) => ($isActive ? 1 : 0.5)};
  transition: opacity 0.3s ease, color 0.3s ease;
  font-size: clamp(2rem, 5vw, 4rem);
  line-height: 1;
  max-width: 100%;
  overflow-wrap: anywhere;
  animation: ${fadeInPreserveOpacity} 0.5s ease backwards;
  animation-delay: ${({ $index = 0 }) => 0.15 + $index * STAGGER_DELAY}s;

  &:hover {
    opacity: 1;
  }

  &::selection {
    background-color: ${COLORS.primary};
    color: ${COLORS.tertiary};
  }
`;

const NavLinks = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: clamp(1rem, 5vw, 6.5rem);

  @media (max-width: 768px) {
    display: none;
  }

  @media (max-width: 480px) {
    gap: 1rem 1.5rem;
  }
`;

const BurgerButton = styled.button<{ $isOpen: boolean }>`
  display: none;
  border: 0;
  padding: 0;
  margin: 0;
  background: transparent;
  width: 2.25rem;
  height: 2.25rem;
  position: relative;
  z-index: 40;

  @media (max-width: 768px) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  span {
    position: absolute;
    width: 1.8rem;
    height: 2px;
    border-radius: 999px;
    background-color: ${({ $isOpen }) => ($isOpen ? '#fff' : '#000')};
    transition: transform 0.3s ease, opacity 0.3s ease,
      background-color 0.3s ease;
  }

  span:first-child {
    transform: ${({ $isOpen }) =>
      $isOpen ? 'rotate(45deg)' : 'translateY(-6px)'};
  }

  span:last-child {
    transform: ${({ $isOpen }) =>
      $isOpen ? 'rotate(-45deg)' : 'translateY(6px)'};
  }
`;

const MobileOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  visibility: ${({ $isOpen }) => ($isOpen ? 'visible' : 'hidden')};
  pointer-events: ${({ $isOpen }) => ($isOpen ? 'auto' : 'none')};
  transition: opacity 0.35s ease, visibility 0.35s ease;
  z-index: 30;

  @media (min-width: 769px) {
    display: none;
  }
`;

const MobileNavLinks = styled.div<{ $isOpen: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  transform: ${({ $isOpen }) =>
    $isOpen ? 'translateY(0)' : 'translateY(10px)'};
  transition: opacity 0.35s ease, transform 0.35s ease;
`;

const MobileNavLink = styled(Link)<{ $index: number; $isOpen: boolean }>`
  font-family: 'Helvetica Neue Bold', sans-serif;
  text-decoration: none;
  text-transform: lowercase;
  color: #fff;
  font-size: clamp(2.2rem, 12vw, 3.8rem);
  line-height: 1;
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  transform: ${({ $isOpen }) =>
    $isOpen ? 'translateY(0)' : 'translateY(10px)'};
  transition: opacity 0.3s ease, transform 0.3s ease, color 0.2s ease;
  transition-delay: ${({ $isOpen, $index }) =>
    $isOpen ? `${0.08 + $index * 0.08}s` : '0s'};

  &:hover {
    color: ${COLORS.secondary};
  }
`;

const Logo = styled.img`
  object-fit: contain;
  width: clamp(130px, 19vw, 250px);
  height: auto;
  max-width: 100%;
  opacity: 0;
  animation: ${fadeIn} 0.5s ease forwards;
  transition: transform 200ms ease, opacity 200ms ease;

  &:hover {
    transform: scale(1.01);
    cursor: pointer;
    opacity: 0.95;
  }

  &:active {
    transform: scale(0.99);
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    opacity: 1;
    transition: none;
  }

  &::selection {
    background-color: transparent;
  }
`;

const Nav = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isActive = (path: string) => location.pathname === path;
  const isProject =
    location.pathname.startsWith('/work/') && location.pathname !== '/work';

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  return (
    <NavContainer>
      <Link to="/">
        <Logo src={logo} alt="logo" />
      </Link>
      <BurgerButton
        type="button"
        $isOpen={isMenuOpen}
        onClick={() => setIsMenuOpen((open) => !open)}
        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isMenuOpen}
      >
        <span />
        <span />
      </BurgerButton>
      <NavLinks>
        <NavLink
          to="/work"
          $isActive={isActive('/work') || isProject}
          $isProject={isProject}
          $index={0}
        >
          work
        </NavLink>
        <NavLink to="/about" $isActive={isActive('/about')} $index={1}>
          about
        </NavLink>
        <NavLink to="/contact" $isActive={isActive('/contact')} $index={2}>
          contact
        </NavLink>
      </NavLinks>
      <MobileOverlay $isOpen={isMenuOpen}>
        <MobileNavLinks $isOpen={isMenuOpen}>
          <MobileNavLink
            to="/work"
            $index={0}
            $isOpen={isMenuOpen}
            onClick={() => setIsMenuOpen(false)}
          >
            work
          </MobileNavLink>
          <MobileNavLink
            to="/about"
            $index={1}
            $isOpen={isMenuOpen}
            onClick={() => setIsMenuOpen(false)}
          >
            about
          </MobileNavLink>
          <MobileNavLink
            to="/contact"
            $index={2}
            $isOpen={isMenuOpen}
            onClick={() => setIsMenuOpen(false)}
          >
            contact
          </MobileNavLink>
        </MobileNavLinks>
      </MobileOverlay>
    </NavContainer>
  );
};

export default Nav;
