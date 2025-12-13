import React from "react";
import {
  HashRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";
import { Navbar } from "./components/Navbar";

import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Trips } from "./pages/Trips";
import { CalendarPage } from "./pages/CalendarPage";
import { PrivateCourses } from "./pages/PrivateCourses";
import { ResourcesPage } from "./pages/ResourcesPage";
import { SocialEvents } from "./pages/SocialEvents";
import { Profile } from "./pages/Profile";
import { SocialWall } from "./pages/SocialWall";

import { Admin } from "./pages/Admin";
import { AdminTrips } from "./pages/AdminTrips";
import { AdminUsers } from "./pages/AdminUsers";
import { AdminSettings } from "./pages/AdminSettings";
import { AdminCourses } from "./pages/AdminCourses";
import { AdminEvents } from "./pages/AdminEvents";

import { GeminiDiveGuide } from "./components/GeminiDiveGuide";

// Guard component for private routes
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useApp();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
};

// Guard component for Instructor/Admin routes (Activities)
const InstructorRoute = ({ children }: { children: React.ReactNode }) => {
  const { canManageTrips } = useApp();

  if (!canManageTrips()) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};

// Guard component for Super Admin routes (Users + Settings)
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { canManageSystem } = useApp();

  if (!canManageSystem()) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};

const AppContent = () => {
  const { currentUser, clubSettings } = useApp();

  return (
    <div
      className="min-h-screen font-sans text-gray-900 bg-fixed bg-cover transition-all duration-500"
      style={{
        backgroundImage: `linear-gradient(rgba(249, 250, 251, 0.95), rgba(249, 250, 251, 0.95)), url("${clubSettings.appBackgroundUrl}")`,
        backgroundColor: "#f9fafb",
      }}
    >
      <Navbar />

      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Private */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/trips"
          element={
            <PrivateRoute>
              <Trips />
            </PrivateRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <PrivateRoute>
              <CalendarPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/courses-private"
          element={
            <PrivateRoute>
              <PrivateCourses />
            </PrivateRoute>
          }
        />
        <Route
          path="/resources"
          element={
            <PrivateRoute>
              <ResourcesPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/social-events"
          element={
            <PrivateRoute>
              <SocialEvents />
            </PrivateRoute>
          }
        />
        <Route
          path="/social-wall"
          element={
            <PrivateRoute>
              <SocialWall />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        {/* Admin hub */}
        <Route
          path="/admin"
          element={
            <InstructorRoute>
              <Admin />
            </InstructorRoute>
          }
        />

        {/* Management (Instructor/Admin) */}
        <Route
          path="/admin-trips"
          element={
            <InstructorRoute>
              <AdminTrips />
            </InstructorRoute>
          }
        />
        <Route
          path="/admin-courses"
          element={
            <InstructorRoute>
              <AdminCourses />
            </InstructorRoute>
          }
        />
        <Route
          path="/admin-events"
          element={
            <InstructorRoute>
              <AdminEvents />
            </InstructorRoute>
          }
        />

        {/* Management (Admin only) */}
        <Route
          path="/admin-users"
          element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          }
        />
        <Route
          path="/admin-settings"
          element={
            <AdminRoute>
              <AdminSettings />
            </AdminRoute>
          }
        />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>

      {/* AI Assistant - Only visible if logged in */}
      {currentUser && <GeminiDiveGuide />}
    </div>
  );
};

const App = () => {
  return (
    <AppProvider>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </AppProvider>
  );
};

export default App;
