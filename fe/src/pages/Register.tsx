import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/auth/AuthContext";

export default function RegisterPage() {
  const { actions } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Mật khẩu không khớp!");
      return;
    }

    setLoading(true);
    const result = await actions.register({
      name,
      email,
      password,
      phone,
      confirmPassword,
    });

    setLoading(false);

    if (result.success) {
      navigate("/login");
    }

    setName("");
    setEmail("");
    setPhone("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black bg-hero-gradient relative overflow-hidden">
      {/* wave background */}
      <div className="wave opacity-30"></div>

      <div className="w-full max-w-md p-8 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 shadow-2xl">
        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white">
            Đăng ký tài khoản mới
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Họ và Tên
            </label>
            <input
              type="text"
              className="w-full bg-black/40 text-white border border-white/10 rounded-lg px-4 py-2.5 
              focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition placeholder-gray-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nguyen Van A"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Email</label>
            <input
              type="email"
              className="w-full bg-black/40 text-white border border-white/10 rounded-lg px-4 py-2.5 
              focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition placeholder-gray-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Số Điện Thoại
            </label>
            <input
              type="phone"
              className="w-full bg-black/40 text-white border border-white/10 rounded-lg px-4 py-2.5 
              focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition placeholder-gray-500"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="1234567890"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Mật Khẩu</label>
            <input
              type="password"
              className="w-full bg-black/40 text-white border border-white/10 rounded-lg px-4 py-2.5 
              focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition placeholder-gray-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Xác Nhận Mật Khẩu
            </label>
            <input
              type="password"
              className="w-full bg-black/40 text-white border border-white/10 rounded-lg px-4 py-2.5 
              focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition placeholder-gray-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-lg font-semibold 
            shadow-lg hover:shadow-orange-500/30 hover:scale-[1.02] transition-all duration-200"
          >
            {loading ? "Currently Registering..." : "Register"}
          </button>

          {/* Login */}
          <p className="text-center text-gray-400 text-sm">
            Đã có tài khoản?{" "}
            <Link to="/login" className="text-accent hover:underline">
              Đăng nhập
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
