import React from "react";
import Header from "./Header";

export default function Layout({ children }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Header />
      <div style={{ flex: 1, position: "relative" }}>
        {children}
      </div>
    </div>
  );
}