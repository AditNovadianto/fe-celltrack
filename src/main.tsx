import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import React from 'react'
import SignIn from './pages/SignIn.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/signIn',
    element: <SignIn />,
  },
  // {
  //   path: '/signUp',
  //   element: <SignUp />
  // },
  // {
  //   path: '/panel',
  //   element: <Panel />
  // },
  // {
  //   path: '*',
  //   element: <NotFound />
  // },
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_skipActionErrorRevalidation: true,
  } as any,
}
)

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
