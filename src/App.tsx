import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { CurrencyProvider } from "@/hooks/useCurrency";
import { AdminLayout } from "@/components/admin/AdminLayout";
import Index from "./pages/Index";
import Catalogue from "./pages/Catalogue";
import CarDetail from "./pages/CarDetail";
import Reservation from "./pages/Reservation";
import Confirmation from "./pages/Confirmation";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import Dashboard from "./pages/admin/Dashboard";
import Voitures from "./pages/admin/Voitures";
import Categories from "./pages/admin/Categories";
import Reservations from "./pages/admin/Reservations";
import Clients from "./pages/admin/Clients";
import Settings from "./pages/admin/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CurrencyProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/catalogue" element={<Catalogue />} />
              <Route path="/voiture/:id" element={<CarDetail />} />
              <Route path="/reservation/:id" element={<Reservation />} />
              <Route path="/confirmation/:id" element={<Confirmation />} />
              <Route path="/a-propos" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="voitures" element={<Voitures />} />
                <Route path="categories" element={<Categories />} />
                <Route path="reservations" element={<Reservations />} />
                <Route path="clients" element={<Clients />} />
                <Route path="settings" element={<Settings />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CurrencyProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
