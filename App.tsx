import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

function Home() {
  return (
    <div style={pageStyle}>
      <h1>🏠 HOME</h1>
      <Link to="/login">Anar a Login</Link>
    </div>
  );
}

function Login() {
  return (
    <div style={pageStyle}>
      <h1>🔐 LOGIN</h1>
      <Link to="/dashboard">Entrar al panell</Link>
    </div>
  );
}

function Dashboard() {
  return (
    <div style={pageStyle}>
      <h1>📊 PANELL</h1>
      <Link to="/">Tornar a Home</Link>
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  background: "#020617",
  color: "white",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 16,
  fontFamily: "system-ui",
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
