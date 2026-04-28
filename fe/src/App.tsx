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
import BookingPage from "./pages/Booking";
import BookingHistory from "./pages/BookingHistory";
import DashboardPage from "./pages/admin/Dashboard";
import BookingManagementPage from "./pages/admin/BookingManagement";
import CustomerManagementPage from "./pages/admin/CustomerManagement";
import RoomManagementPage from "./pages/admin/RoomManagement";

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
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/history" element={<BookingHistory />} />
        </Route>

        <Route path="/admin/login" element={<LoginForAdmin />} />
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="bookings" element={<BookingManagementPage />} />
            <Route path="customers" element={<CustomerManagementPage />} />
            <Route path="rooms" element={<RoomManagementPage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}
