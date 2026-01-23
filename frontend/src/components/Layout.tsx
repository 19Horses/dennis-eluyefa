import { COLORS } from '../constants';
import Nav from './Nav';
import { styled } from 'styled-components';

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
`;

const LayoutContent = styled.div`
  width: 100%;
  height: 100%;
  flex-grow: 1;
  margin: 0 auto;
  background-color: ${COLORS.primary};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
