import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const RoomSidebar = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // 1. Khởi tạo State từ URL (nếu có)
  const [filter, setFilter] = useState({
    checkIn: searchParams.get("checkIn") || "",
    checkOut: searchParams.get("checkOut") || "",
    guests: searchParams.get("guests") || "1",
  });

  // 2. Cập nhật UI nếu URL thay đổi (ví dụ khách nhấn tìm kiếm lại ở Header)
  useEffect(() => {
    setFilter({
      checkIn: searchParams.get("checkIn") || "",
      checkOut: searchParams.get("checkOut") || "",
      guests: searchParams.get("guests") || "1",
    });
  }, [searchParams]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  const handleApply = () => {
    if (
      filter.checkIn &&
      filter.checkOut &&
      new Date(filter.checkIn) >= new Date(filter.checkOut)
    ) {
      alert("Ngày trả phòng phải sau ngày nhận phòng!");
      return;
    }

    setSearchParams({
      checkIn: filter.checkIn,
      checkOut: filter.checkOut,
      guests: filter.guests,
    });
  };

  return (
    <aside className="lg:col-span-1 fixed top-32 z-50">
      <div className="bg-white sticky top-24 p-8 rounded-2xl shadow-sm border border-gray-200">
        <h2 className="text-xl text-gray-900 font-bold mb-6 flex items-center gap-2">
          <span className="w-1 h-6 bg-teal-500 rounded-full"></span>
          Tìm Kiếm
        </h2>

        <div className="space-y-6">
          {/* Kiểm tra ngày */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <h3 className="text-sm font-bold text-gray-700 uppercase mb-4 tracking-wider">
              Kiểm Tra Ngày
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-[14px] text-gray-600 block mb-1 font-medium">
                  Ngày Nhận Phòng
                </label>
                <input
                  type="date"
                  name="checkIn"
                  value={filter.checkIn}
                  onChange={handleInputChange}
                  className="w-full bg-white border text-black border-gray-200 rounded-lg px-6 py-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-[14px] text-gray-600 block mb-1 font-medium">
                  Ngày Trả Phòng
                </label>
                <input
                  type="date"
                  name="checkOut"
                  value={filter.checkOut}
                  onChange={handleInputChange}
                  className="w-full bg-white border text-black border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Số người */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <h3 className="text-sm font-bold text-gray-700 uppercase mb-4 tracking-wider">
              Số Người Ở
            </h3>
            <select
              name="guests"
              value={filter.guests}
              onChange={handleInputChange}
              className="w-full bg-white border text-black border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none cursor-pointer"
            >
              <option value="1">1 Người lớn</option>
              <option value="2">2 Người lớn</option>
              <option value="4">4 Người lớn</option>
            </select>
          </div>

          {/* Loại Phòng (Checkbox Filter) */}
          <div className="px-1">
            <h3 className="text-sm font-bold text-gray-700 uppercase mb-4 tracking-wider">
              Loại Phòng
            </h3>
            <div className="space-y-3">
              {["Phòng Bình Dân", "Phòng Đơn", "Phòng VIP"].map((type) => (
                <label
                  key={type}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500 accent-teal-500"
                  />
                  <span className="text-sm text-gray-600 group-hover:text-teal-600 transition-colors font-medium">
                    {type}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Nút Áp Dụng */}
          <button
            onClick={handleApply}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-teal-500/20 active:scale-[0.98]"
          >
            ÁP DỤNG BỘ LỌC
          </button>
        </div>
      </div>
    </aside>
  );
};

export default RoomSidebar;
