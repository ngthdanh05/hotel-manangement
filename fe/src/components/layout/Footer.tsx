const Footer = () => {
  return (
    <footer className="bg-[#050505] border-t border-white/5 py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-gray-500 text-sm">
          © 2026 HotelBits. Tất cả quyền lợi được bảo lưu.
        </div>

        <div className="flex gap-8 text-sm text-gray-400">
          <a href="#" className="hover:text-white transition-colors">
            Điều khoản
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Bảo mật
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Liên hệ
          </a>
        </div>

        <div className="flex gap-4">
          {/* Social Icons Placeholder */}
          <div className="w-8 h-8 bg-white/5 rounded-full border border-white/10 hover:bg-white/10 transition-colors cursor-pointer" />
          <div className="w-8 h-8 bg-white/5 rounded-full border border-white/10 hover:bg-white/10 transition-colors cursor-pointer" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
