import { COLORS } from '../constants';
import Nav from './Nav';
import { styled } from 'styled-components';

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100dvh;
  min-height: 100vh;
  overflow: hidden;
`;

const LayoutContent = styled.div`
  width: 100%;
  flex: 1 1 auto;
  min-height: 0;
  background-color: ${COLORS.primary};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: auto;
`;

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <LayoutContainer>
      <Nav />
      <LayoutContent>{children}</LayoutContent>
    </LayoutContainer>
  );
};

export default Layout;
