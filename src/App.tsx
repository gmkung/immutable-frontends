
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import Index from "./pages/Index";
import Submit from "./pages/Submit";
import NotFound from "./pages/NotFound";

// TypeScript declaration for ethereum in window
declare global {
  interface Window {
    ethereum?: any;
  }
}

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => {
  useEffect(() => {
    // Check if MetaMask is installed
    const checkMetaMask = () => {
      if (typeof window.ethereum === 'undefined') {
        console.log('MetaMask is not installed. Some features may be unavailable.');
      }
    };
    
    checkMetaMask();
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          <Toaster />
          <Sonner position="top-right" closeButton theme="light" />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/submit" element={<Submit />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
