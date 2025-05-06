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

// TODO: split into different routers per children to have them cleaner e.g. Books, App, Reviews, etc.
const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <GlobalErrorBoundary />, //  Catch errors from every child route
    children: [
      {
        // Redirect by default to /reviews
        // FIXME it defaults to reviews but if you are logged out it should redirect to login page
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
      {
        path: "books",
      },
    ],
  },
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
        <h1>Platonica</h1>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  );
}
export default App;
