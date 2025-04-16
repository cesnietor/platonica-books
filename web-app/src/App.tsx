import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import BookReviews from "./Screens/Reviews";
import { Navigate, Route, Routes } from "react-router-dom";
import NotFound from "./Screens/NotFound";
import BookDetails from "./Screens/BookDetails";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <h1>Platonica</h1>
      <Routes>
        <Route path={"/"} element={<Navigate to="/reviews" replace />} />
        <Route path={"/reviews"} element={<BookReviews />} />
        <Route path={"*"} element={<NotFound />} />
        <Route path="/books/:uuid" element={<BookDetails />} />
      </Routes>
    </QueryClientProvider>
  );
}
export default App;
