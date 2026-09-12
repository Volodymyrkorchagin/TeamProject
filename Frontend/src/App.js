import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout"; 
import Registration from "./Registration";
import Home from "./Home";
import Product from "./Product";
import ProductsList from "./ProductsList";
import HeaderLayout from "./HeaderLayout";

function ProtectedRoute({ children }) {
  const userData = localStorage.getItem("userData");

  if (!userData) {
    return <Navigate to="/registration" replace />;
  }

  return children;
}

function PublicRoute({ children }) {
  const userData = localStorage.getItem("userData");

  if (userData) {
    return <Navigate to="/home" replace />;
  }

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
    <HeaderLayout>
      <Routes>
        <Route path="/" element={<Layout />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/product" element={<Product />} />
        <Route path="/productsList" element={<ProductsList />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
      </Routes>
      </HeaderLayout>
    </BrowserRouter>
  );
}