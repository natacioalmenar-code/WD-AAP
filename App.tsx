import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";

// PÀGINES
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Dashboard } from "./pages/Dashboard";
import { Profile } from "./pages/Profile";
import { Trips } from "./pages/Trips";
import { CoursesPublic } from "./pages/CoursesPublic";
import { PrivateCourses } from "./pages/PrivateCourses";
import { SocialEvents } from "./pages/SocialEvents";
import { SocialWall } from "./pages/SocialWall";
import { ResourcesPage } from "./pages/ResourcesPage";
import { CalendarPage } from "./pages/CalendarPage";
import { Help } from "./pages/Help";
import { Terms } from "./pages/Terms";
import { Privacy } from "./pages/Privacy";
import { Cookies } from "./pages/Cookies";
import { PendingApproval } from "./pages/PendingApproval";
import { VirtualDiveMaster } from "./pages/VirtualDiveMaster";

// ADMIN
import { AdminUsers } from "./pages/AdminUsers";
import { AdminTrips } from "./pages/AdminTrips";
import { AdminCourses } from "./pages/AdminCourses";
import { AdminEvents } from "./pages/AdminEvents";
import { AdminSettings } from "./pages/AdminSettings";

export default function App() {
  const location = useLocation();

  // (Opcional) si NO vols navbar/footer a login/register:
  const hideChrome =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="min-h-screen flex flex-col">
      {!hideChrome && <Navbar />}

      <main className="flex-1">
        <Routes>
          {/* PÚBLIQUES */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/cookies" element={<Cookies />} />

          {/* USUARI */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/trips" element={<Trips />} />
          <Route path="/courses" element={<CoursesPublic />} />
          <Route path="/my-courses" element={<PrivateCourses />} />
          <Route path="/events" element={<SocialEvents />} />
          <Route path="/wall" element={<SocialWall />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/help" element={<Help />} />
          <Route path="/pending" element={<PendingApproval />} />
          <Route path="/virtual-dive-master" element={<VirtualDiveMaster />} />

          {/* ADMIN */}
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/trips" element={<AdminTrips />} />
          <Route path="/admin/courses" element={<AdminCourses />} />
          <Route path="/admin/events" element={<AdminEvents />} />
          <Route path="/admin/settings" element={<AdminSettings />} />

          {/* FALLBACK */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      {!hideChrome && <Footer />}
    </div>
  );
}
