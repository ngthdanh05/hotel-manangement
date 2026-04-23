import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import MainLayout from "./components/layout/MainLayout";
import LoginForAdmin from "./pages/LoginForAdmin";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/layout/AdminLayout";
import RoomsPage from "./pages/Rooms";
import AboutPage from "./pages/About";
import ContactPage from "./pages/Contact";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<RoomsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route path="/admin/login" element={<LoginForAdmin />} />
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            {/* <Route index element={<DashBoard />} />
            <Route path="categories" element={<CategoryManagement />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="users" element={<UsersManagement />} />
            <Route path="orders" element={<OrdersManagement />} /> */}
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}
