import { Outlet, useLocation } from 'react-router';
import { styled } from 'styled-components';
import { COLORS } from '../constants';
import { useIsMobile } from '../hooks/useIsMobile';
import Footer from './Footer';
import Nav from './Nav';

const LayoutContainer = styled.div<{
  $lockScroll: boolean;
  $pageScroll: boolean;
}>`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100dvh;
  min-height: 0;
  box-sizing: border-box;
  overflow: ${({ $lockScroll }) => ($lockScroll ? 'hidden' : 'auto')};
  overscroll-behavior: ${({ $lockScroll }) => ($lockScroll ? 'none' : 'auto')};
  scroll-snap-type: ${({ $lockScroll, $pageScroll }) =>
    $lockScroll || $pageScroll ? 'none' : 'y mandatory'};
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

const PageViewport = styled.div<{
  $isLanding: boolean;
  $pageScroll: boolean;
}>`
  position: relative;
  flex: ${({ $pageScroll }) => ($pageScroll ? '0 0 auto' : '0 0 100dvh')};
  width: 100%;
  min-height: ${({ $pageScroll }) => ($pageScroll ? '0' : '100dvh')};
  height: ${({ $pageScroll }) => ($pageScroll ? 'auto' : '100dvh')};
  display: flex;
  flex-direction: column;
  overflow: ${({ $pageScroll }) => ($pageScroll ? 'visible' : 'hidden')};
  background-color: ${({ $isLanding }) =>
    $isLanding ? COLORS.primary : COLORS.secondary};
  transition: background-color 0.45s ease;
  box-sizing: border-box;
  scroll-snap-align: ${({ $pageScroll }) => ($pageScroll ? 'none' : 'start')};
  scroll-snap-stop: ${({ $pageScroll }) => ($pageScroll ? 'normal' : 'always')};
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

const LayoutContent = styled.div<{ $pageScroll: boolean }>`
  width: 100%;
  min-height: 0;
  height: auto;
  flex: ${({ $pageScroll }) => ($pageScroll ? '0 0 auto' : '1 1 0')};
  padding-top: 10dvh;
  background-color: ${COLORS.primary};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: ${({ $pageScroll }) =>
    $pageScroll ? 'flex-start' : 'center'};
  overflow: ${({ $pageScroll }) => ($pageScroll ? 'visible' : 'hidden')};
  box-sizing: border-box;

  > * {
    width: 100%;
    height: ${({ $pageScroll }) => ($pageScroll ? 'auto' : '100%')};
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
  // Desktop work: one continuous page scroll (nav + grid + footer).
  const isWorkPageScroll = !isMobile && location.pathname === '/work';

  return (
    <LayoutContainer
      data-layout-scroll
      $lockScroll={lockContactMobileScroll}
      $pageScroll={isWorkPageScroll}
    >
      <PageViewport $isLanding={isLanding} $pageScroll={isWorkPageScroll}>
        <Nav onLanding={isLanding} />
        {isLanding ? (
          <LandingContent>
            <Outlet />
          </LandingContent>
        ) : (
          <LayoutContent $pageScroll={isWorkPageScroll}>
            <Outlet />
          </LayoutContent>
        )}
      </PageViewport>
      {!lockContactMobileScroll && <Footer attached={isWorkPageScroll} />}
    </LayoutContainer>
  );
};

export default Layout;
