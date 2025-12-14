import React from "react";
import { HashRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";
import { Navbar } from "./components/Navbar";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Trips } from "./pages/Trips";
import { CoursesPublic } from "./pages/CoursesPublic";
import { AdminUsers } from "./pages/AdminUsers";
import { AdminSettings } from "./pages/AdminSettings";
import { CalendarPage } from "./pages/CalendarPage";
import { PrivateCourses } from "./pages/PrivateCourses";
import { ResourcesPage } from "./pages/ResourcesPage";
import { SocialEvents } from "./pages/SocialEvents";
import { Profile } from "./pages/Profile";
import { SocialWall } from "./pages/SocialWall";
import { GeminiDiveGuide } from "./components/GeminiDiveGuide";

import { Admin } from "./pages/Admin";
import { AdminCourses } from "./pages/AdminCourses";
import { AdminEvents } from "./pages/AdminEvents";
import { AdminTrips } from "./pages/AdminTrips";
import { PendingApproval } from "./pages/PendingApproval";

// Només necessita estar loguejat/da (encara que estiga pending)
const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useApp();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
};

// Necessita estar loguejat/da i APROVAT/DA (active)
const ActiveRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useApp();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si està pendent, el deixem veure públic però NO privat
  if (currentUser.status !== "active") {
    // Evitem bucle
    if (location.pathname !== "/pending") {
      return <Navigate to="/pending" replace />;
    }
  }

  return <>{children}</>;
};

const InstructorRoute = ({ children }: { children: React.ReactNode }) => {
  const { canManageTrips } = useApp();
  if (!canManageTrips()) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { canManageSystem } = useApp();
  if (!canManageSystem()) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

const AppContent = () => {
  const { currentUser, clubSettings } = useApp();

  return (
    <div
      className="min-h-screen font-sans text-gray-900 bg-fixed bg-cover transition-all duration-500"
      style={{
        backgroundImage: `linear-gradient(rgba(249, 250, 251, 0.95), rgba(249, 250, 251, 0.95)), url("${clubSettings.appBackgroundUrl || ""}")`,
        backgroundColor: "#f9fafb",
      }}
    >
      <Navbar />

      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/courses-public" element={<CoursesPublic />} />
        <Route path="/login" element={<Login />} />

        {/* Pending page (només loguejat/da) */}
        <Route
          path="/pending"
          element={
            <AuthRoute>
              <PendingApproval />
            </AuthRoute>
          }
        />

        {/* Private (només ACTIVE) */}
        <Route
          path="/dashboard"
          element={
            <ActiveRoute>
              <Dashboard />
            </ActiveRoute>
          }
        />
        <Route
          path="/trips"
          element={
            <ActiveRoute>
              <Trips />
            </ActiveRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <ActiveRoute>
              <CalendarPage />
            </ActiveRoute>
          }
        />
        <Route
          path="/courses-private"
          element={
            <ActiveRoute>
              <PrivateCourses />
            </ActiveRoute>
          }
        />
        <Route
          path="/resources"
          element={
            <ActiveRoute>
              <ResourcesPage />
            </ActiveRoute>
          }
        />
        <Route
          path="/social-events"
          element={
            <ActiveRoute>
              <SocialEvents />
            </ActiveRoute>
          }
        />
        <Route
          path="/social-wall"
          element={
            <ActiveRoute>
              <SocialWall />
            </ActiveRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ActiveRoute>
              <Profile />
            </ActiveRoute>
          }
        />

        {/* Admin / Instructor (ja impliquen active perquè canManage... ho demana) */}
        <Route
          path="/admin"
          element={
            <InstructorRoute>
              <Admin />
            </InstructorRoute>
          }
        />
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
      </Routes>

      {currentUser && currentUser.status === "active" && <GeminiDiveGuide />}
    </div>
  );
};

const App = () => (
  <AppProvider>
    <HashRouter>
      <AppContent />
    </HashRouter>
  </AppProvider>
);

export default App;
