import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";

// Prayer Pages
import LiturgyOfHoursPage from "./pages/prayer/LiturgyOfHoursPage";
import RosaryPage from "./pages/prayer/RosaryPage";

// Study Pages
import LibraryPage from "./pages/study/LibraryPage";

// Community Pages
import LiturgicalCalendarPage from "./pages/community/LiturgicalCalendarPage";
import SaintsPage from "./pages/community/SaintsPage";
import ProvincesPage from "./pages/community/ProvincesPage";

// Preaching Pages
import DailyReflectionsPage from "./pages/preaching/DailyReflectionsPage";

// Import Tempo Devtools
import { TempoDevtools } from "tempo-devtools";

// Initialize Tempo Devtools
TempoDevtools.init();

const queryClient = new QueryClient();

// Create a TempoRoutes component to handle Tempo routes
const TempoRoutes = () => {
  // Only import and use routes when VITE_TEMPO is true
  if (import.meta.env.VITE_TEMPO) {
    // Dynamic import to ensure it's only loaded when needed
    const routes = require("tempo-routes").default;
    const { useRoutes } = require("react-router-dom");
    return useRoutes(routes);
  }
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        {/* Render both app routes and Tempo routes within the Router context */}
        <Routes>
          {/* Tempo routes path - must be before other routes */}
          {import.meta.env.VITE_TEMPO && (
            <Route path="/tempobook/*" element={<TempoRoutes />} />
          )}

          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />

            {/* Prayer Routes */}
            <Route
              path="/prayer/liturgy-of-the-hours"
              element={<LiturgyOfHoursPage />}
            />
            <Route path="/prayer/rosary" element={<RosaryPage />} />

            {/* Study Routes */}
            <Route path="/study/library" element={<LibraryPage />} />

            {/* Community Routes */}
            <Route
              path="/community/liturgical-calendar"
              element={<LiturgicalCalendarPage />}
            />
            <Route path="/community/saints" element={<SaintsPage />} />
            <Route path="/community/provinces" element={<ProvincesPage />} />

            {/* Preaching Routes */}
            <Route
              path="/preaching/daily-reflections"
              element={<DailyReflectionsPage />}
            />

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
