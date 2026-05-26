import { Outlet } from 'react-router';
import { styled } from 'styled-components';
import { COLORS } from '../constants';
import Footer from './Footer';
import Nav from './Nav';

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100dvh;
  min-height: 0;
  box-sizing: border-box;
  overflow: hidden;
`;

const LayoutContent = styled.div`
  width: 100%;
  min-height: 0;
  height: auto;
  flex: 1 1 0;
  background-color: ${COLORS.primary};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: auto;
  box-sizing: border-box;

  @media (max-width: 768px) {
    overflow: hidden;
  }
`;

const Layout = () => {
  return (
    <LayoutContainer>
      <Nav />
      <LayoutContent>
        <Outlet />
      </LayoutContent>
      <Footer />
    </LayoutContainer>
  );
};

export default Layout;
