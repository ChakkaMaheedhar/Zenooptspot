import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/useAuth";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Welcome from "./pages/Welcome";
import BusinessPage from "./pages/Businesses/BusinessPage";
import UsersPage from "./pages/Users/UsersPage";
import Inbox from "./pages/Future/Inbox";
import Reviews from "./pages/Future/Reviews";
import MainLayout from "./components/MainLayout";

// Mobile pages
import Ocard from "./pages/Mobile/Ocard";
import Kiosk from "./pages/Mobile/Kiosk";

// Metrics pages
import Coupons from "./pages/Future/Metrics/Coupons";
import AllCoupons from "./pages/Future/Coupons/AllCoupons";
import MetaAds from "./pages/Future/Metrics/MetaAds";
import GoogleAds from "./pages/Future/Metrics/GoogleAds";
import Keywords from "./pages/Future/Metrics/Keywords";
import LinkTracker from "./pages/Future/Metrics/LinkTracker";
import ClubMembers from "./pages/Future/Metrics/ClubMembers";
import OnlineReviews from "./pages/Future/Metrics/OnlineReviews";

// SMS pages
import SMSMarketing from "./pages/Future/SMS/Marketing";
import SMSRetention from "./pages/Future/SMS/Retention";
import SMSChurn from "./pages/Future/SMS/Churn";
import ContactOptOut from "./pages/Future/SMS/ContactOptOut";

// Campaigns pages
import CampaignsMarketing from "./pages/Future/Campaigns/Marketing";

// Resources pages
import Forms from "./pages/Future/Resources/Forms";
import MACCalculator from "./pages/Future/Resources/MACCalculator";
import Podcast from "./pages/Future/Resources/Podcast";
import FeatureRequest from "./pages/Future/Resources/FeatureRequest";

export default function App() {
  const { user, isLoading } = useAuth();

  console.log("App render:", { user: !!user, isLoading });

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          fontSize: 18,
          color: "#00523f",
        }}
      >
        Loading...
      </div>
    );
  }

  if (!user) {
    console.log("No user, showing login");
    return <Login />;
  }

  console.log("Showing MainLayout with user:", user);
  return (
    <MainLayout>
      <Routes>
        {/* Welcome/Dashboard */}
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/businesses" element={<BusinessPage />} />
        <Route path="/users" element={<UsersPage />} />

        {/* Mobile Routes */}
        <Route path="/mobile/ocard" element={<Ocard />} />
        <Route path="/mobile/kiosk" element={<Kiosk />} />

        {/* Metrics Routes */}
        <Route path="/metrics-coupons" element={<AllCoupons />} />
        <Route path="/metrics-meta" element={<MetaAds />} />
        <Route path="/metrics-google" element={<GoogleAds />} />
        <Route path="/metrics-keywords" element={<Keywords />} />
        <Route path="/metrics-link" element={<LinkTracker />} />
        <Route path="/metrics-club" element={<ClubMembers />} />
        <Route path="/metrics-reviews" element={<OnlineReviews />} />

        {/* SMS Routes */}
        <Route path="/sms-marketing" element={<SMSMarketing />} />
        <Route path="/sms-retention" element={<SMSRetention />} />
        <Route path="/sms-churn" element={<SMSChurn />} />
        <Route path="/sms-contact" element={<ContactOptOut />} />

        {/* General Routes */}
        <Route path="/inbox" element={<Inbox />} />
        <Route path="/reviews" element={<Reviews />} />

        {/* Coupons Routes */}
        <Route path="/coupons-all" element={<Coupons />} />

        {/* Campaigns Routes */}
        <Route path="/campaigns" element={<CampaignsMarketing />} />

        {/* Resources Routes */}
        <Route path="/resources-forms" element={<Forms />} />
        <Route path="/resources-mac" element={<MACCalculator />} />
        <Route path="/resources-podcast" element={<Podcast />} />
        <Route path="/resources-feature" element={<FeatureRequest />} />

        {/* Default route */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </MainLayout>
  );
}
