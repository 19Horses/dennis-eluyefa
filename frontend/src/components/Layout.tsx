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
  min-height: 100vh;
  box-sizing: border-box;
`;

const LayoutContent = styled.div`
  width: 100%;
  min-height: 90%;
  height: 90%;
  flex: 1 1 auto;
  background-color: ${COLORS.primary};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: auto;
  box-sizing: border-box;
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
