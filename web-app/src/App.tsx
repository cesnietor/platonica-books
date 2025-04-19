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

// TODO: split into different routers per children to have them cleaner e.g. Books, App, Reviews, etc.
const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <GlobalErrorBoundary />, //  Catch errors from every child route
    children: [
      {
        // Redirect by default to /reviews
        index: true,
        element: <Navigate to="/reviews" replace />,
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
      <h1>Platonica</h1>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
export default App;
