import React from "react";
import { HashRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

import { AppProvider, useApp } from "./context/AppContext";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";

import { VirtualDiveMaster } from "./pages/VirtualDiveMaster";
import { ChatPage } from "./pages/ChatPage";

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

import { Help } from "./pages/Help";
import { Privacy } from "./pages/Privacy";
import { Terms } from "./pages/Terms";
import { Cookies } from "./pages/Cookies";

import { AdminUsers } from "./pages/AdminUsers";
import { AdminTrips } from "./pages/AdminTrips";
import { AdminCourses } from "./pages/AdminCourses";
import { AdminEvents } from "./pages/AdminEvents";
import { AdminSettings } from "./pages/AdminSettings";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useApp();
  const location = useLocation();

  if (!currentUser) return <Navigate to="/login" state={{ from: location }} replace />;

  const role = (currentUser.role || "").toString().toLowerCase();
  const status = (currentUser.status || "").toString().toLowerCase();
  const isPending = role === "pending" || status === "pending";

  if (isPending && location.pathname !== "/pending" && location.pathname !== "/profile") {
    return <Navigate to="/pending" replace />;
  }

  return <>{children}</>;
};

const AdminOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, canManageSystem } = useApp();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (!canManageSystem()) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

const AppContent = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* PUBLIC */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/help" element={<Help />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/cookies" element={<Cookies />} />

          {/* Cursos públics */}
          <Route path="/courses-public" element={<CoursesPublic />} />

          {/* PRIVAT */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
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
            path="/trips"
            element={
              <PrivateRoute>
                <Trips />
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
          <Route
            path="/pending"
            element={
              <PrivateRoute>
                <PendingApproval />
              </PrivateRoute>
            }
          />

          {/* Social Events (privat) */}
          <Route
            path="/social-events"
            element={
              <PrivateRoute>
                <SocialEvents />
              </PrivateRoute>
            }
          />

          {/* ✅ Alias perquè /events també funcioni */}
          <Route
            path="/events"
            element={
              <PrivateRoute>
                <SocialEvents />
              </PrivateRoute>
            }
          />

          {/* Formació (privada) */}
          <Route
            path="/courses-private"
            element={
              <PrivateRoute>
                <PrivateCourses />
              </PrivateRoute>
            }
          />

          {/* ✅ Alias perquè /my-courses també funcioni si el tenies */}
          <Route
            path="/my-courses"
            element={
              <PrivateRoute>
                <PrivateCourses />
              </PrivateRoute>
            }
          />

          {/* ✅ XAT: ara és privat (evita que usuaris pending puguin veure'l) */}
          <Route
            path="/chat"
            element={
              <PrivateRoute>
                <ChatPage />
              </PrivateRoute>
            }
          />

          {/* ✅ Dive Master: nova ruta (evita el conflicte amb /chat) */}
          <Route
            path="/dive-master"
            element={
              <PrivateRoute>
                <VirtualDiveMaster />
              </PrivateRoute>
            }
          />

          {/* ADMIN */}
          <Route
            path="/admin-users"
            element={
              <AdminOnlyRoute>
                <AdminUsers />
              </AdminOnlyRoute>
            }
          />
          <Route
            path="/admin-trips"
            element={
              <AdminOnlyRoute>
                <AdminTrips />
              </AdminOnlyRoute>
            }
          />
          <Route
            path="/admin-courses"
            element={
              <AdminOnlyRoute>
                <AdminCourses />
              </AdminOnlyRoute>
            }
          />
          <Route
            path="/admin-events"
            element={
              <AdminOnlyRoute>
                <AdminEvents />
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

          {/* ✅ Alias /admin -> admin-users */}
          <Route path="/admin" element={<Navigate to="/admin-users" replace />} />

          {/* FALLBACK */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </AppProvider>
  );
}
