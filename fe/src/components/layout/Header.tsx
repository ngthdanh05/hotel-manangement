import { Link } from "react-router-dom";

const Header = () => {
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
          <a
            href="/booking"
            className="hover:text-orange-600 transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-orange-500 hover:after:w-full after:transition-all"
          >
            Khách sạn
          </a>
          <a href="#" className="hover:text-orange-600 transition-colors">
            Về chúng tôi
          </a>
          <a href="#" className="hover:text-orange-600 transition-colors">
            Liên hệ
          </a>
        </div>
      </nav>
    </header>
  );
};

export default Header;
