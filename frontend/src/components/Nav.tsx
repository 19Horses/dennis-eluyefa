import { Link, useLocation } from "react-router";
import { styled } from "styled-components";
import { COLORS } from "../constants";

const NavContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  padding: clamp(0.5rem, 2vw, 1rem) clamp(0.75rem, 3vw, 1.5rem);
  max-width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const NavLink = styled(Link)<{ $isActive: boolean }>`
  font-family: 'Helvetica Neue Bold', sans-serif;
  text-decoration: none;
  color: ${COLORS.primary};
  font-weight: bold;
  opacity: ${({ $isActive }) => $isActive ? 1 : 0.5};
  transition: opacity 0.3s ease;
  font-size: clamp(2.25rem, 6vw, 4.75rem); /* 36px → 76px */
  line-height: 1;
  max-width: 100%;
  overflow-wrap: anywhere;
  &:hover {
    opacity: 1;
  }
`;

const NavLinks = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: clamp(1.5rem, 6vw, 8rem);

  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-start;
  }

  @media (max-width: 480px) {
    gap: 1rem 1.5rem;
  }
`;

const Nav = () => {
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;
  return (
    <NavContainer>
    <NavLink $isActive={isActive('/')} style={{ flexGrow: 1 }} to="/">home</NavLink>
    <NavLinks>
      <NavLink to="/work" $isActive={isActive('/work')}>work</NavLink>
      <NavLink to="/about" $isActive={isActive('/about')}>about</NavLink>
      <NavLink to="/contact" $isActive={isActive('/contact')}>contact</NavLink>
    </NavLinks>
    </NavContainer>
  );
};

export default Nav;