import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import UploadLayout from "./pages/UploadLayout";
import SavedReports from "./pages/SavedReports";
import ErrorPage from "./pages/ErrorPage";
import RootLayout from "./pages/RootLayout";
import ReportDetailPage from "./pages/ReportDetailPage";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      errorElement: <ErrorPage />,
      children: [
        { index: true, element: <UploadLayout /> },
        {
          path: "/reports",
          element: <SavedReports />,
        },
        { path: "/reports/:id", element: <ReportDetailPage /> },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
