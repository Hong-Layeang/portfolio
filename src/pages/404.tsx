import * as React from "react";
import { Link, HeadFC, PageProps } from "gatsby";

const NotFoundPage: React.FC<PageProps> = () => {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#060610",
        color: "#e8e8f0",
        fontFamily: "'DM Sans', sans-serif",
        textAlign: "center",
        padding: "48px 24px",
      }}
    >
      <span
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "clamp(100px, 20vw, 200px)",
          lineHeight: 1,
          color: "rgba(0, 229, 255, 0.12)",
          letterSpacing: "0.08em",
        }}
      >
        404
      </span>
      <h1
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "clamp(28px, 5vw, 48px)",
          letterSpacing: "0.06em",
          marginTop: "-20px",
        }}
      >
        PAGE NOT FOUND
      </h1>
      <p
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "12px",
          letterSpacing: "0.15em",
          color: "rgba(232, 232, 240, 0.4)",
          marginTop: "16px",
          marginBottom: "40px",
        }}
      >
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "11px",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "#060610",
          background: "#00e5ff",
          padding: "14px 32px",
          textDecoration: "none",
          transition: "all 0.3s",
        }}
      >
        BACK TO HOME
      </Link>
    </main>
  );
};

export default NotFoundPage;

export const Head: HeadFC = () => <title>404 — Not Found</title>;
