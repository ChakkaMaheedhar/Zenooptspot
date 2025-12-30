import React from "react";
import { useLocation } from "react-router-dom";

export default function PlaceholderPage() {
  const location = useLocation();

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>Coming Soon</h1>
      <p>
        Page for: <strong>{location.pathname}</strong>
      </p>
      <p>This page is under development.</p>
    </div>
  );
}
