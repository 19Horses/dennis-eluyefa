import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import Layout from './components/Layout';
import { SplashScreen } from './components/SplashScreen';
import { About, Contact, Home, Project, Work } from './pages';

const queryClient = new QueryClient();

const App = () => {
  const [isSplashComplete, setIsSplashComplete] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      {isSplashComplete ? (
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="work" element={<Work />} />
              <Route path="work/:slug" element={<Project />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
            </Route>
          </Routes>
        </BrowserRouter>
      ) : (
        <SplashScreen onComplete={() => setIsSplashComplete(true)} />
      )}
    </QueryClientProvider>
  );
};

export default App;
