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
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const STAGGER_DELAY = 0.1;

const NavLink = styled(Link) <{
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
    width: 100%;
    justify-content: flex-start;
  }

  @media (max-width: 480px) {
    gap: 1rem 1.5rem;
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
  const isActive = (path: string) => location.pathname === path;
  const isProject =
    location.pathname.startsWith('/work/') && location.pathname !== '/work';
  return (
    <NavContainer>
      <Link to="/">
        <Logo src={logo} alt="logo" />
      </Link>
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
    </NavContainer>
  );
};

export default Nav;
