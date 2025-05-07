import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Reviews from "./Screens/Reviews";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import NotFound from "./Screens/NotFound";
import Review from "./Screens/Review";
import BookDetails from "./Screens/BookDetails";
import GlobalErrorBoundary from "./Screens/GlobalErrorBoundary";
import { AuthProvider } from "./auth/AuthProvider";
import { LoginScreen } from "./Screens/LoginScreen";
import { RequireAuth } from "./auth/RequireAuth";
import { Typography } from "@mui/material";

// TODO: split into different routers per children to have them cleaner e.g. Books, App, Reviews, etc.
const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <GlobalErrorBoundary />, //  Catch errors from every child route
    children: [
      // Public routes
      {
        path: "login",
        element: <LoginScreen />,
      },
      // Protected routes
      {
        element: <RequireAuth />, // Serves as parent element to authenticate routes
        children: [
          {
            // Redirect by default to /reviews
            index: true,
            element: <Navigate to="/reviews" replace />,
          },
          {
            path: "login",
            element: <LoginScreen />,
          },
          {
            path: "reviews",
            element: <Reviews />,
          },
          {
            path: "reviews/:reviewUuid",
            element: <Review />,
            children: [
              {
                path: "book",
                element: <BookDetails />,
                errorElement: <GlobalErrorBoundary />,
              },
            ],
          },
        ],
      },
    ],
  },
  // Fallback NotFound
  {
    path: "*",
    element: <NotFound />,
  },
]);

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Typography variant="h4" align="left">
          Platonica
        </Typography>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  );
}
export default App;
