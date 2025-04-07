import { createBrowserRouter, RouterProvider, ScrollRestoration } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import Contract from './components/iddPages/Contract';
import Customer from './components/iddPages/Customer';
import AuthProvider from './components/utils/AuthProvider';
import { ProtectedRoutes } from './components/utils/ProtectedRoutes';
import Layout from './Layout';
import Contracts from './pages/Contracts';
import Customers from './pages/Customers';
import Home from './pages/Home';
import Login from './pages/Login';
import Orders from './pages/Orders';
import Settings from './pages/Settings';
import Warehouse from './pages/Warehouse';
import { theme } from './theme';

//   return !nextUrl.pathname.startsWith('/klienci');

// const shouldRevalidate = ({ currentUrl, nextUrl }: { currentUrl: URL; nextUrl: URL }): boolean => {
//   // Only revalidate if we're not navigating within the customers section
//   // and we're not using browser navigation (back/forward)
//   const isCustomerRoute = (url: URL) => url.pathname.startsWith('/klienci');

//   if (isCustomerRoute(currentUrl) && isCustomerRoute(nextUrl)) {
//     return false;
//   }

//   // Default to true for other routes
//   return true;
// };

export const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  {
    element: <ProtectedRoutes />,
    children: [
      {
        element: <Layout />,
        children: [
          { path: '/', element: <Home /> },
          { path: '/zamowienia', element: <Orders /> },
          { path: '/kontrakty', element: <Contracts /> },
          { path: '/kontrakty/:id', element: <Contract /> },
          { path: '/klienci', element: <Customers /> },
          { path: '/klienci/:nip', element: <Customer /> },
          { path: '/ustawienia', element: <Settings /> },
          { path: '/magazyn', element: <Warehouse /> },
        ],
      },
    ],
  },
]);

//   children: [
//     {
//       index: true,
//       element: <Customers />,
//       loader: customersLoader,
//     },
//     { path: ':nip', element: <Customer /> },
//   ],
// },        shouldRevalidate,

// function customersLoader() {
//   const token = localStorage.getItem('token');
//   if (!token) return [];
//   console.log('FETCHING');
//   // loadedCustomers.sort(compareName);
//   return getCustomersTiles(token);
// }

// shouldRevalidate: ({ currentUrl, nextUrl }) => {
//   return true;
// },
// return !nextUrl.pathname.startsWith('/klienci');
