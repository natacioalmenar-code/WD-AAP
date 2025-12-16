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
import { Footer } from "./components/Footer";

import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";

import { Dashboard } from "./pages/Dashboard";
import { Trips } from "./pages/Trips";
import { CoursesPublic } from "./pages/CoursesPublic";
import { CalendarPage } from "./pages/CalendarPage";
import { PrivateCourses } from "./pages/PrivateCourses";
import { ResourcesPage } from "./pages/ResourcesPage";
import { SocialEvents } from "./pages/SocialEvents";
import { Profile } from "./pages/Profile";
import { SocialWall } from "./pages/SocialWall";
import { PendingApproval } from "./pages/PendingApproval";

import { Admin } from "./pages/Admin";
import { AdminCourses } from "./pages/AdminCourses";
import { AdminEvents } from "./pages/AdminEvents";
import { AdminTrips } from "./pages/AdminTrips";
import { AdminUsers } from "./pages/AdminUsers";
import { AdminSettings } from "./pages/AdminSettings";

import { Help } from "./pages/Help";
import { Privacy } from "./pages/Privacy";
import { Terms } from "./pages/Terms";
import { Cookies } from "./pages/Cookies";

import { GeminiDiveGuide } from "./components/GeminiDiveGuide";

/** ✅ Ruta privada: cal estar loguejat i (si toca) actiu */
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useApp();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // admin no queda bloquejat per "pending"
  const shouldGoPending =
    currentUser.role === "pending" ||
    (currentUser.status !== "active" && currentUser.role !== "admin");

  // Permetem veure /pending i /profile (per completar dades), però la resta no.
  if (
    shouldGoPending &&
    location.pathname !== "/pending" &&
    location.pathname !== "/profile"
  ) {
    return <Navigate to="/pending" replace />;
  }

  return <>{children}</>;
};

/** ✅ Millora: rutes de gestió (admin/instructor segons permisos del context) */
const ManageTripsRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, canManageTrips } = useApp();

  if (!currentUser) return <Navigate to="/login" replace />;
  if (!canManageTrips()) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
};

/** ✅ Millora: rutes d’admin “de veritat” (només admin sistema) */
const AdminOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, canManageSystem } = useApp();

  if (!currentUser) return <Navigate to="/login" replace />;
  if (!canManageSystem()) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
};

const AppContent = () => {
  const { currentUser, clubSettings, isActiveMember } = useApp();

  return (
    <div
      className="min-h-screen font-sans text-gray-900 bg-fixed bg-cover transition-all duration-500 flex flex-col"
      style={{
        backgroundImage: `linear-gradient(rgba(249, 250, 251, 0.95), rgba(249, 250, 251, 0.95)), url("${
          clubSettings.appBackgroundUrl || ""
        }")`,
        backgroundColor: "#f9fafb",
      }}
    >
      <Navbar />

      <div className="flex-1">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/courses-public" element={<CoursesPublic />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Legal / ajuda */}
          <Route path="/help" element={<Help />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/cookies" element={<Cookies />} />

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
            path="/pending"
            element={
              <PrivateRoute>
                <PendingApproval />
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

          {/* ✅ Gestió (admin/instructor si el teu context ho permet) */}
          <Route
            path="/admin"
            element={
              <ManageTripsRoute>
                <Admin />
              </ManageTripsRoute>
            }
          />
          <Route
            path="/admin-trips"
            element={
              <ManageTripsRoute>
                <AdminTrips />
              </ManageTripsRoute>
            }
          />
          <Route
            path="/admin-courses"
            element={
              <ManageTripsRoute>
                <AdminCourses />
              </ManageTripsRoute>
            }
          />
          <Route
            path="/admin-events"
            element={
              <ManageTripsRoute>
                <AdminEvents />
              </ManageTripsRoute>
            }
          />

          {/* ✅ Admin “sistema” (només admin) */}
          <Route
            path="/admin-users"
            element={
              <AdminOnlyRoute>
                <AdminUsers />
              </AdminOnlyRoute>
            }
          />
          <Route
            path="/admin-settings"
            element={
              <AdminOnlyRoute>
                <AdminSettings />
              </AdminOnlyRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* ✅ Millora: només mostrar Gemini si és membre actiu */}
        {currentUser && isActiveMember() && <GeminiDiveGuide />}
      </div>

      <Footer />
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
