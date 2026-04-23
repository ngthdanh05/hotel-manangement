import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { useAuth } from "../../context/auth/AuthContext";

const Header = () => {
  const { isAuthenticated, user, actions } = useAuth();
  const [isDesktop, setIsDesktop] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  console.log(user);
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 856);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    await actions.logout();
    window.location.href = "/";
  };

  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-7xl select-none">
      <nav className="bg-white/10 backdrop-blur-md border border-white/10 rounded-full px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <svg
            width="32"
            height="32"
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
          <span className="text-xl font-bold text-white tracking-wide">
            Lux<span className="text-[#c8a96e]">Stay</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 font-medium text-gray-100">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `relative transition-colors hover:text-orange-600 
       after:content-[''] after:absolute after:bottom-[-4px] after:left-0 
       after:h-[2px] after:bg-orange-500 after:transition-all
       ${isActive ? "after:w-full text-orange-500" : "after:w-0 hover:after:w-full"}`
            }
          >
            Trang Chủ
          </NavLink>

          <NavLink
            to="/rooms"
            className={({ isActive }) =>
              `relative transition-colors hover:text-orange-600 
       after:content-[''] after:absolute after:bottom-[-4px] after:left-0 
       after:h-[2px] after:bg-orange-500 after:transition-all
       ${isActive ? "after:w-full text-orange-500" : "after:w-0 hover:after:w-full"}`
            }
          >
            Phòng
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              `relative transition-colors hover:text-orange-600 
       after:content-[''] after:absolute after:bottom-[-4px] after:left-0 
       after:h-[2px] after:bg-orange-500 after:transition-all
       ${isActive ? "after:w-full text-orange-500" : "after:w-0 hover:after:w-full"}`
            }
          >
            Về Chúng Tôi
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `relative transition-colors hover:text-orange-600 
       after:content-[''] after:absolute after:bottom-[-4px] after:left-0 
       after:h-[2px] after:bg-orange-500 after:transition-all
       ${isActive ? "after:w-full text-orange-500" : "after:w-0 hover:after:w-full"}`
            }
          >
            Liên Hệ
          </NavLink>
        </div>

        <div className="hidden md:flex">
          {isAuthenticated ? (
            <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
              <Popover.Trigger asChild>
                <div
                  onClick={() => isDesktop && setIsOpen(true)}
                  className="w-12 h-12 rounded-full overflow-hidden border border-gray-300 shadow-sm hover:shadow-md transition cursor-pointer"
                >
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2c-3.2 0-9.5 1.6-9.5 4.9V22h19v-3.1c0-3.3-6.3-4.9-9.5-4.9z" />
                  </svg>
                </div>
              </Popover.Trigger>

              <Popover.Portal>
                <Popover.Content
                  side="bottom"
                  align="end"
                  className=" bg-white p-4 shadow-lg border border-gray-200 rounded-md w-64 z-50"
                  onClick={() => isDesktop && setIsOpen(false)}
                >
                  <p className="font-semibold mb-2 text-gray-800">
                    Xin chào, <span className="text-sky-600">{user?.name}</span>
                  </p>

                  <Link
                    to="/account"
                    className="block w-full text-left text-gray-700 hover:bg-sky-100 hover:text-sky-800 rounded px-3 py-2 transition"
                  >
                    Quản lý hồ sơ
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="mt-2 block w-full text-left text-red-600 hover:bg-red-100 hover:text-red-700 rounded px-3 py-2 transition outline-none cursor-pointer"
                  >
                    Đăng xuất
                  </button>

                  <Popover.Arrow className="fill-white drop-shadow" />
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          ) : (
            <Link
              to="/login"
              className="bg-gray-800 px-3 py-2 lg:px-5 lg:py-3  rounded-lg hover:bg-gray-700 cursor-pointer"
            >
              <span className="text-white text-base lg:text-lg font-semibold">
                Đăng nhập
              </span>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
