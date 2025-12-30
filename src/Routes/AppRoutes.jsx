import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import { useAuth } from "../context/useAuth";

import Login from "../pages/Auth/Login";
import Dashboard from "../pages/Dashboard/DashboardPage";
import BusinessPage from "../pages/Businesses/BusinessPage";
import Ocard from "../pages/Mobile/Ocard";
import Kiosk from "../pages/Mobile/Kiosk";
import PlaceholderPage from "../pages/PlaceholderPage";

function AppRoutes() {
  const { user } = useAuth();
  const isAuthenticated = !!user;

  return (
    <Routes>
      {/* ✅ PUBLIC ROUTE */}
      <Route path="/login" element={<Login />} />

      {/* ✅ PROTECTED ROUTES - Wrap all pages with MainLayout */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <MainLayout>
              <Outlet />
            </MainLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      >
        {/* Default/Dashboard */}
        <Route index element={<Navigate to="/dashboard" replace />} />

        {/* Dashboard & Main Pages */}
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="welcome" element={<Dashboard />} />
        <Route path="businesses" element={<BusinessPage />} />

        {/* Mobile Pages */}
        <Route path="mobile/ocard" element={<Ocard />} />
        <Route path="mobile/kiosk" element={<Kiosk />} />

        {/* Metrics Pages */}
        <Route path="metrics-coupons" element={<PlaceholderPage />} />
        <Route path="metrics-meta" element={<PlaceholderPage />} />
        <Route path="metrics-google" element={<PlaceholderPage />} />
        <Route path="metrics-keywords" element={<PlaceholderPage />} />
        <Route path="metrics-link" element={<PlaceholderPage />} />
        <Route path="metrics-club" element={<PlaceholderPage />} />
        <Route path="metrics-reviews" element={<PlaceholderPage />} />

        {/* SMS Pages */}
        <Route path="sms-marketing" element={<PlaceholderPage />} />
        <Route path="sms-retention" element={<PlaceholderPage />} />
        <Route path="sms-churn" element={<PlaceholderPage />} />
        <Route path="sms-contact" element={<PlaceholderPage />} />

        {/* Other Pages */}
        <Route path="inbox" element={<PlaceholderPage />} />
        <Route path="reviews" element={<PlaceholderPage />} />
        <Route path="resources-forms" element={<PlaceholderPage />} />
        <Route path="resources-mac" element={<PlaceholderPage />} />
        <Route path="resources-podcast" element={<PlaceholderPage />} />
        <Route path="resources-feature" element={<PlaceholderPage />} />

        {/* Catch-all - redirect unknown routes to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
