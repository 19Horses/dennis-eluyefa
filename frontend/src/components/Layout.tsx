import { Outlet, useLocation } from 'react-router';
import { styled } from 'styled-components';
import { COLORS } from '../constants';
import { useIsMobile } from '../hooks/useIsMobile';
import Footer from './Footer';
import Nav from './Nav';

const LayoutContainer = styled.div<{ $lockScroll: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100dvh;
  min-height: 0;
  box-sizing: border-box;
  overflow: ${({ $lockScroll }) => ($lockScroll ? 'hidden' : 'auto')};
  overscroll-behavior: ${({ $lockScroll }) => ($lockScroll ? 'none' : 'auto')};
  scroll-snap-type: ${({ $lockScroll }) =>
    $lockScroll ? 'none' : 'y mandatory'};
  scroll-behavior: smooth;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 768px) {
    overflow: hidden;
    overscroll-behavior: none;
    scroll-snap-type: none;
  }
`;

const PageViewport = styled.div<{ $isLanding: boolean }>`
  position: relative;
  flex: 0 0 100dvh;
  width: 100%;
  min-height: 100dvh;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: ${({ $isLanding }) =>
    $isLanding ? COLORS.primary : COLORS.secondary};
  transition: background-color 0.45s ease;
  box-sizing: border-box;
  scroll-snap-align: start;
  scroll-snap-stop: always;
`;

const LandingContent = styled.div`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  min-height: 0;
  background-color: ${COLORS.primary};
  overflow: hidden;
  box-sizing: border-box;

  > * {
    width: 100%;
    height: 100%;
    min-height: 0;
  }
`;

const LayoutContent = styled.div`
  width: 100%;
  min-height: 0;
  height: auto;
  flex: 1 1 0;
  padding-top: 10dvh;
  background-color: ${COLORS.primary};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-sizing: border-box;

  > * {
    width: 100%;
    height: 100%;
    min-height: 0;
  }

  @media (max-width: 768px) {
    padding-top: 0;
  }
`;

const Layout = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const isLanding = location.pathname === '/' && !isMobile;
  const lockContactMobileScroll = isMobile && location.pathname === '/contact';

  return (
    <LayoutContainer data-layout-scroll $lockScroll={lockContactMobileScroll}>
      <PageViewport $isLanding={isLanding}>
        <Nav onLanding={isLanding} />
        {isLanding ? (
          <LandingContent>
            <Outlet />
          </LandingContent>
        ) : (
          <LayoutContent>
            <Outlet />
          </LayoutContent>
        )}
      </PageViewport>
      {!lockContactMobileScroll && <Footer />}
    </LayoutContainer>
  );
};

export default Layout;
