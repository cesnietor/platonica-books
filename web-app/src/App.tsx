import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Reviews from "./Screens/Reviews";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import NotFound from "./Screens/NotFound";
import BookDetails from "./Screens/BookDetails";

// TODO: split into different routers per children to have them cleaner e.g. Books, App, Reviews, etc.
const router = createBrowserRouter([
  {
    path: "/",
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
        path: "books",
        children: [
          {
            path: ":uuid",
            element: <BookDetails />,
          },
        ],
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
