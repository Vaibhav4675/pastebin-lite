export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#fafafa",
        padding: 24,
      }}
    >
      <div
        style={{
          maxWidth: 500,
          background: "white",
          padding: 24,
          borderRadius: 8,
          border: "1px solid #e5e7eb",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: 24, fontWeight: 600 }}>
          Paste not available
        </h1>

        <p style={{ marginTop: 12, color: "#555" }}>
          This paste does not exist, has expired, or has reached its view limit.
        </p>

        <a
          href="/"
          style={{
            display: "inline-block",
            marginTop: 20,
            padding: "10px 16px",
            background: "#000",
            color: "#fff",
            borderRadius: 6,
            textDecoration: "none",
            fontSize: 14,
          }}
        >
          Create a new paste
        </a>
      </div>
    </main>
  );
}
