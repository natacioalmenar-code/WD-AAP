import React from "react";

function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui",
        textAlign: "center",
        padding: 24,
      }}
    >
      <div>
        <h1 style={{ fontSize: 32, fontWeight: 800 }}>
          ✅ WEST DIVERS APP
        </h1>
        <p style={{ marginTop: 12, fontSize: 18 }}>
          React està funcionant correctament.
        </p>
        <p style={{ marginTop: 8, opacity: 0.8 }}>
          Si veus això, el problema NO és Vercel ni el navegador.
        </p>
      </div>
    </div>
  );
}

export default App;
