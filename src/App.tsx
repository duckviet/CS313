import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./components/Layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000 * 5, // 5 minutes
      refetchOnWindowFocus: false, // Disable refetch on window focus if not needed
    },
  },
});
function App() {
  return (
    <Router>
      <MainLayout>
        <QueryClientProvider client={queryClient}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </QueryClientProvider>
      </MainLayout>
    </Router>
  );
}

export default App;
