import { NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolder,
  faHouse,
  faPlus,
  faSignOutAlt,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../context/auth/AuthContext";

const menuItems = [
  {
    id: 0,
    label: "Dashboard",
    to: ".",
    icon: faHouse,
  },
  {
    id: 1,
    label: "Quản Lý Đặt Phòng",
    to: "bookings",
    icon: faFolder,
  },
  {
    id: 2,
    label: "Quản lý Khách Hàng",
    to: "customers",
    icon: faPlus,
  },
  {
    id: 3,
    label: "Quản lý Phòng",
    to: "rooms",
    icon: faUser,
  },
];

export default function AdminSidebar() {
  const { actions } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await actions.logout();
    navigate("/", { replace: true });
  };

  return (
    <aside className="w-72 h-screen flex flex-col bg-white rounded-2xl border shadow-lg p-5">
      <div className="flex items-center gap-2 mb-8 select-none">
        <svg
          width="42"
          height="42"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="32" height="32" rx="8" fill="rgba(200,169,110,0.12)" />
          <path
            d="M16 6L20 12H26L21 16.5L23 23L16 19L9 23L11 16.5L6 12H12L16 6Z"
            fill="#c8a96e"
            stroke="#c8a96e"
            strokeWidth="0.5"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-2xl font-bold text-gray-700 tracking-wide">
          Peak<span className="text-[#c8a96e]">Stay</span>
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider border-b pb-2 mb-3">
          Main Menu
        </h2>

        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.to}
              end={item.to === "."}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? "bg-blue-100 text-blue-700 font-semibold shadow-sm"
                    : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                }`
              }
            >
              <FontAwesomeIcon icon={item.icon} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="border-t pt-4 mt-auto">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-4 w-full text-left rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition"
        >
          <FontAwesomeIcon icon={faSignOutAlt} />
          <span className="font-medium">Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
}
