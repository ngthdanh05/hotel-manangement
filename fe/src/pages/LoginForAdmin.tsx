import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/auth/AuthContext";

export default function LoginPage() {
  const { actions } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await actions.login({ email, password });
    setLoading(false);

    if (result.success) {
      window.location.href = "/admin";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black bg-hero-gradient relative overflow-hidden select-none">
      <div className="wave opacity-30"></div>

      <div className="w-full max-w-md p-8 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 shadow-2xl">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white">
            Welcome to{" "}
            <span className="text-accent underline decoration-accent/50">
              MY WEBSITE
            </span>
          </h2>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Email</label>
            <input
              type="email"
              className="w-full bg-black/40 text-white border border-white/10 rounded-lg px-4 py-2.5 
              focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition placeholder-gray-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="current-email"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Mật Khẩu</label>
            <input
              type="password"
              className="w-full bg-black/40 text-white border border-white/10 rounded-lg px-4 py-2.5 
              focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition placeholder-gray-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-lg font-semibold 
            shadow-lg hover:shadow-orange-500/30 hover:scale-[1.02] transition-all duration-200"
          >
            {loading ? "Đang đăng nhập..." : "Đăng Nhập"}
          </button>

          <p className="text-center text-gray-400 text-sm">
            Chưa có tài khoản?{" "}
            <Link to="/register" className="text-accent hover:underline">
              Đăng ký
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
