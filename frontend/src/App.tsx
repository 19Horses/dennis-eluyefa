import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router';
import Layout from './components/Layout';
import { SplashScreen } from './components/SplashScreen';
import { About, Contact, Gallery, Home, Project, Work } from './pages';

const queryClient = new QueryClient();

const SPLASH_STORAGE_KEY = 'dennis-eluyefa-splash-last-shown';
const SPLASH_INTERVAL_MS = 6 * 60 * 60 * 1000;

function shouldShowSplash() {
  try {
    const raw = window.localStorage.getItem(SPLASH_STORAGE_KEY);
    if (!raw) return true;

    const lastShownAt = Number(raw);
    if (!Number.isFinite(lastShownAt)) return true;

    return Date.now() - lastShownAt >= SPLASH_INTERVAL_MS;
  } catch {
    return true;
  }
}

function markSplashShown() {
  try {
    window.localStorage.setItem(SPLASH_STORAGE_KEY, String(Date.now()));
  } catch {
    // ignore quota / private mode failures
  }
}

const App = () => {
  const [isSplashComplete, setIsSplashComplete] = useState(
    () => !shouldShowSplash()
  );

  const handleSplashComplete = () => {
    markSplashShown();
    setIsSplashComplete(true);
  };

  return (
    <QueryClientProvider client={queryClient}>
      {isSplashComplete ? (
        <HashRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="work" element={<Work />} />
              <Route path="work/:slug" element={<Project />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="gallery" element={<Gallery />} />
              <Route path="home" element={<Navigate to="/" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </HashRouter>
      ) : (
        <SplashScreen onComplete={handleSplashComplete} />
      )}
    </QueryClientProvider>
  );
};

export default App;
