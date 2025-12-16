import React from "react";

type Props = { children: React.ReactNode };
type State = { hasError: boolean; message?: string };

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(err: any) {
    return { hasError: true, message: String(err?.message || err) };
  }

  componentDidCatch(err: any, info: any) {
    console.error("APP CRASH:", err, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24, fontFamily: "system-ui" }}>
          <h1 style={{ fontSize: 22, fontWeight: 800 }}>⚠️ Error a la web</h1>
          <p>La web ha fallat carregant. Mira la consola per veure on peta.</p>
          <pre
            style={{
              marginTop: 12,
              padding: 12,
              background: "#f6f6f6",
              borderRadius: 8,
              whiteSpace: "pre-wrap",
            }}
          >
            {this.state.message}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}
