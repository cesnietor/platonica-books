import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Books from './Screens/Books';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Books/>
    </QueryClientProvider>
  );
}
export default App;


