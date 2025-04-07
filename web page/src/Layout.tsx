import '@mantine/core/styles.css';
import './components/css/App.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Outlet } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { Navbar } from './components/NavBar';
import { theme } from './theme';

const queryClient = new QueryClient();

export default function Layout() {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme}>
        <div className="mainBox">
          <Navbar />
          <Outlet />
        </div>
      </MantineProvider>
    </QueryClientProvider>
  );
}
