import { createBrowserRouter, RouterProvider, ScrollRestoration } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
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
import { router } from './RouterDec';
import { getCustomersTiles } from './services/api';
import { theme } from './theme';

// const shouldRevalidate = ({ currentUrl, nextUrl }: { currentUrl: URL; nextUrl: URL }): boolean => {
//   // return currentUrl.pathname !== nextUrl.pathname;
//   // return true;
//   // return !nextUrl.pathname.startsWith('/klienci');
//   return currentUrl.pathname !== nextUrl.pathname;
// };

// const router = createBrowserRouter([
// export const router = createBrowserRouter([
//   { path: '/login', element: <Login /> },
//   {
//     element: <ProtectedRoutes />,
//     children: [
//       {
//         element: <Layout />,
//         children: [m,n
//           { path: '/', element: <Home /> },
//           { path: '/zamowienia', element: <Orders /> },
//           { path: '/kontrakty', element: <Contracts /> },
//           {
//             path: '/klienci',
//             element: <Customers />,
//             loader: customersLoader,
//             shouldRevalidate,

//             // shouldRevalidate: ({ currentUrl, nextUrl }) => {
//             //   return true;
//             // },
//             // return !nextUrl.pathname.startsWith('/klienci');
//           },
//           { path: '/klienci/:nip', element: <Customer /> },
//           { path: '/ustawienia', element: <Settings /> },
//           { path: '/magazyn', element: <Warehouse /> },
//         ],
//       },
//     ],
//   },
// ]);

export function Router() {
  return (
    <MantineProvider theme={theme}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </MantineProvider>
  );
}
