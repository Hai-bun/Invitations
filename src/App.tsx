import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import SignIn from "./pages/SignIn";
import AuthGuard from "./components/AuthGuard";
import GuestInvite from "./pages/GuestInvite";
import WeddingDetail from "./pages/WeddingDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route
            path="/admin"
            element={
              <AuthGuard>
                <Admin />
              </AuthGuard>
            }
          />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/invite/:guestId" element={<GuestInvite />} />
          <Route path="/wedding" element={<WeddingDetail />} />
          <Route path="/wedding/:guestId" element={<WeddingDetail />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
