import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import Home from "./pages/Home";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* <Route path="/admin/login" element={<LoginForAdmin />} />
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashBoard />} />
            <Route path="categories" element={<CategoryManagement />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="users" element={<UsersManagement />} />
            <Route path="orders" element={<OrdersManagement />} />
          </Route>
        </Route> */}
      </Routes>
    </Router>
  );
}
