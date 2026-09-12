import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Leaf, User, Home, PlusCircle, Package, LogOut } from "lucide-react";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    navigate("/registration");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <aside style={styles.sidebar}>
      <div style={styles.sidebarIcon} onClick={() => navigate("/")}>
        <Leaf size={22} color="#a4b882" />
      </div>

      <div style={styles.sidebarMenu}>
        <div
          style={{
            ...styles.sidebarIcon,
            backgroundColor: isActive("/home") ? "rgba(255,255,255,0.15)" : "transparent",
          }}
          onClick={() => navigate("/home")}
          title="Dashboard"
        >
          <Home size={20} color={isActive("/home") ? "#fff" : "#d1d5c2"} />
        </div>

        <div
          style={{
            ...styles.sidebarIcon,
            backgroundColor: isActive("/productsList") ? "rgba(255,255,255,0.15)" : "transparent",
          }}
          onClick={() => navigate("/productsList")}
          title="Products List"
        >
          <Package size={20} color={isActive("/productsList") ? "#fff" : "#d1d5c2"} />
        </div>

        <div
          style={{
            ...styles.sidebarIcon,
            backgroundColor: isActive("/product") ? "rgba(255,255,255,0.15)" : "transparent",
          }}
          onClick={() => navigate("/product")}
          title="Add Product"
        >
          <PlusCircle size={20} color={isActive("/product") ? "#fff" : "#d1d5c2"} />
        </div>
      </div>

      <div style={styles.logoutSection}>
        <div style={styles.sidebarIcon} onClick={handleLogout} title="Logout">
          <LogOut size={18} color="#e66a6a" />
        </div>
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: "60px",
    backgroundColor: "#3b4828",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: "20px",
    paddingBottom: "20px",
    justifyContent: "space-between",
    minHeight: "100vh",
    zIndex: 100,
  },
  sidebarMenu: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  sidebarIcon: {
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
  },
  logoutSection: {
    marginTop: "auto",
  },
};