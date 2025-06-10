
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RestaurantProvider } from "@/contexts/RestaurantContext";
import { PageTransitionProvider } from "@/contexts/PageTransitionContext";
import Layout from "@/components/Layout";
import Index from "./pages/Index";
import Menu from "./pages/Menu";
import Support from "./pages/Support";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import UserLogin from "./pages/UserLogin";
import Subscriptions from "./pages/Subscriptions";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000, // 30 seconds
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <RestaurantProvider>
      <PageTransitionProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout><Index /></Layout>} />
              <Route path="/menu" element={<Layout><Menu /></Layout>} />
              <Route path="/support" element={<Layout><Support /></Layout>} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/login" element={<UserLogin />} />
              <Route path="/subscriptions" element={<Layout><Subscriptions /></Layout>} />
              <Route path="*" element={<Layout><NotFound /></Layout>} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </PageTransitionProvider>
    </RestaurantProvider>
  </QueryClientProvider>
);

export default App;
