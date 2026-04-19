import { useState } from 'react';
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { ClaimsListRoute } from '../routes/ClaimsListRoute';
import { DocumentWorkspaceRoute } from '../routes/DocumentWorkspaceRoute';

function RootLayout() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}

export function createAppRouter() {
  return createBrowserRouter([
    {
      path: '/',
      element: <RootLayout />,
      children: [
        { index: true, element: <Navigate to="/claims" replace /> },
        { path: '/claims', element: <ClaimsListRoute /> },
        { path: '/claims/:claimId/documents/:documentId', element: <DocumentWorkspaceRoute /> },
      ],
    },
  ]);
}

export function AppRouter() {
  const [router] = useState(() => createAppRouter());

  return <RouterProvider router={router} />;
}
