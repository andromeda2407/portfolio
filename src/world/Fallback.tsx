export function Fallback() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#060a0e",
        color: "#d6e2e9",
        fontFamily: "ui-monospace, Menlo, monospace",
        textAlign: "center",
        padding: 24,
      }}
    >
      <h1 style={{ color: "#35d07f" }}>3D world needs a modern browser</h1>
      <p style={{ color: "#7d95a3", maxWidth: 420 }}>
        Your browser or device can&apos;t run WebGL. No problem — everything is on the main
        site.
      </p>
      <a href="/" style={{ marginTop: 24, color: "#35d07f" }}>
        ← Back to portfolio
      </a>
    </main>
  );
}
