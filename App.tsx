import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { useApp } from "./context/AppContext";

import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";

// Public pages
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { FecdAs } from "./pages/FecdAs";
import { Cmas } from "./pages/Cmas";

// Private pages
import { Dashboard } from "./pages/Dashboard";
import { SocialWall } from "./pages/SocialWall";
import { Trips } from "./pages/Trips";
import { Courses } from "./pages/Courses";
import { SocialEvents } from "./pages/SocialEvents";
import { Resources } from "./pages/Resources";
import { Calendar } from "./pages/Calendar";
import { Help } from "./pages/Help";
import { Profile } from "./pages/Profile";

// Admin pages
import { Admin } from "./pages/Admin";
import { UsersAdmin } from "./pages/UsersAdmin";
import { AdminWeb } from "./pages/AdminWeb";

// (optional) if you have it and want it later
import { VirtualDiveMaster } from "./pages/VirtualDiveMaster";

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      {/* Navbar és sticky, però li donem aire */}
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { currentUser } = useApp();
  if (!currentUser) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { canManageSystem } = useApp();
  if (!canManageSystem()) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<HomeOrLogin />} />
      <Route path="/register" element={<Register />} />
      <Route path="/fecd-as" element={<FecdAs />} />
      <Route path="/cmas" element={<Cmas />} />

      {/* PRIVATE (require auth) */}
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <Shell>
              <Dashboard />
            </Shell>
          </RequireAuth>
        }
      />
      <Route
        path="/wall"
        element={
          <RequireAuth>
            <Shell>
              <SocialWall />
            </Shell>
          </RequireAuth>
        }
      />
      <Route
        path="/trips"
        element={
          <RequireAuth>
            <Shell>
              <Trips />
            </Shell>
          </RequireAuth>
        }
      />
      <Route
        path="/courses"
        element={
          <RequireAuth>
            <Shell>
              <Courses />
            </Shell>
          </RequireAuth>
        }
      />
      <Route
        path="/events"
        element={
          <RequireAuth>
            <Shell>
              <SocialEvents />
            </Shell>
          </RequireAuth>
        }
      />
      <Route
        path="/resources"
        element={
          <RequireAuth>
            <Shell>
              <Resources />
            </Shell>
          </RequireAuth>
        }
      />
      <Route
        path="/calendar"
        element={
          <RequireAuth>
            <Shell>
              <Calendar />
            </Shell>
          </RequireAuth>
        }
      />
      <Route
        path="/help"
        element={
          <RequireAuth>
            <Shell>
              <Help />
            </Shell>
          </RequireAuth>
        }
      />
      <Route
        path="/profile"
        element={
          <RequireAuth>
            <Shell>
              <Profile />
            </Shell>
          </RequireAuth>
        }
      />

      {/* ADMIN */}
      <Route
        path="/admin"
        element={
          <RequireAuth>
            <RequireAdmin>
              <Shell>
                <Admin />
              </Shell>
            </RequireAdmin>
          </RequireAuth>
        }
      />
      <Route
        path="/admin-users"
        element={
          <RequireAuth>
            <RequireAdmin>
              <Shell>
                <UsersAdmin />
              </Shell>
            </RequireAdmin>
          </RequireAuth>
        }
      />
      <Route
        path="/admin-web"
        element={
          <RequireAuth>
            <RequireAdmin>
              <Shell>
                <AdminWeb />
              </Shell>
            </RequireAdmin>
          </RequireAuth>
        }
      />

      {/* (opcional) Virtual Dive Master */}
      <Route
        path="/virtual-dive-master"
        element={
          <RequireAuth>
            <Shell>
              <VirtualDiveMaster />
            </Shell>
          </RequireAuth>
        }
      />

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

/**
 * Si vols que /login mostre la teua pantalla de Login (i no Home),
 * canvia açò a: return <Login />;
 *
 * Ara ho deixe així perquè el teu Home ja té botó “Accés Socis/es”.
 */
function HomeOrLogin() {
  // Si preferixes el Login directament:
  return <Login />;
}

