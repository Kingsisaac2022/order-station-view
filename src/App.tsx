
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CreatePurchaseOrder from "./pages/CreatePurchaseOrder";
import NotFound from "./pages/NotFound";
import { OrderProvider } from "./context/OrderContext";
import { FleetProvider } from "./context/FleetContext";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import TrackOrderPage from "./pages/TrackOrderPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <FleetProvider>
        <OrderProvider>
          <BrowserRouter>
            <Toaster />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/create-purchase-order" element={<CreatePurchaseOrder />} />
              <Route path="/order/:id" element={<OrderDetailsPage />} />
              <Route path="/track/:id" element={<TrackOrderPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </OrderProvider>
      </FleetProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
