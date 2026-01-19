import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from './pages/Home';
import { BrowserRouter, Route, Routes } from 'react-router';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
