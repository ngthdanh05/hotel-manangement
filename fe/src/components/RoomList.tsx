import { useEffect, useState } from "react";
import httpRequest from "../utils/httpRequest";

interface RoomType {
  MaLoaiPhong: number;
  TenLoai: string;
  MoTa: string;
  Gia: number;
  SoNguoi: number;
  SoPhongTrong: number | string;
  ConPhong: number; // Trường từ View
}

const ROOM_IMAGES: Record<string, string> = {
  "Phòng bình dân":
    "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=800",
  "Phòng VIP 1":
    "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=800",
  "Phòng VIP 2":
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800",
  "Phòng VIP 3":
    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=800",
  "Phòng đơn":
    "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=800",
  Default:
    "https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=800",
};

const RoomList = () => {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const endpoint = `/rooms?${params.toString()}`;
        const res = await httpRequest(endpoint);
        setRoomTypes(res.data.data);
      } catch (err) {
        console.error("Lỗi fetch dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium animate-pulse">
          Đang tìm kiếm phòng trống tốt nhất cho bạn...
        </p>
      </div>
    );

  return (
    <div className="flex flex-col gap-12 p-6 w-full max-w-6xl mx-auto py-12">
      {roomTypes.map((type) => {
        const isAvailable = Number(type.ConPhong) === 1;

        return (
          <div
            key={type.MaLoaiPhong}
            className="group relative flex flex-col md:flex-row bg-white rounded-[3rem] shadow-[0_10px_50px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_70px_rgba(0,0,0,0.08)] border border-gray-50 overflow-hidden transition-all duration-500"
          >
            {/* TRÁI: HÌNH ẢNH & BADGE */}
            <div className="relative w-full md:w-[42%] h-80 md:h-auto overflow-hidden">
              <img
                src={ROOM_IMAGES[type.TenLoai] || ROOM_IMAGES["Default"]}
                className={`w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 ${
                  !isAvailable ? "grayscale contrast-75 brightness-75" : ""
                }`}
                alt={type.TenLoai}
              />

              {/* Overlay cho phòng hết */}
              {!isAvailable && (
                <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center">
                  <div className="bg-white/90 px-6 py-2 rounded-full shadow-xl">
                    <span className="text-gray-900 font-black text-sm tracking-widest uppercase">
                      Hết chỗ
                    </span>
                  </div>
                </div>
              )}

              {/* Status Badge */}
              <div
                className={`absolute top-6 left-6 px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] shadow-lg backdrop-blur-md ${
                  isAvailable
                    ? "bg-teal-500/90 text-white"
                    : "bg-rose-500/90 text-white"
                }`}
              >
                {isAvailable ? "Sẵn sàng" : "Hẹn dịp khác"}
              </div>
            </div>

            {/* PHẢI: NỘI DUNG */}
            <div className="p-10 md:p-12 flex-1 flex flex-col justify-between bg-gradient-to-br from-white to-gray-50/50">
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                  <div>
                    <h3 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
                      {type.TenLoai}
                    </h3>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1.5 text-gray-500 text-xs font-bold bg-gray-100 px-3 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                        Tối đa {type.SoNguoi} khách
                      </span>
                      {isAvailable && (
                        <span className="text-teal-600 text-[10px] font-black uppercase tracking-widest">
                          Cực kỳ phổ biến
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="bg-white px-5 py-3 rounded-[2rem] border border-gray-100 shadow-sm text-center min-w-[140px]">
                    <p className="text-2xl font-black text-teal-600 leading-none">
                      {Number(type.Gia).toLocaleString()}
                    </p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">
                      VNĐ / Đêm
                    </p>
                  </div>
                </div>

                <p className="text-gray-500 leading-relaxed text-base line-clamp-3 mb-8 italic">
                  "{type.MoTa}"
                </p>

                {/* Tiện ích nhanh */}
                <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-100">
                  {["Wifi", "Điều hòa", "Ăn sáng"].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase"
                    >
                      <div className="w-1 h-1 bg-teal-400 rounded-full"></div>
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-12 flex items-center justify-between">
                <div>
                  {isAvailable ? (
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest animate-pulse">
                      ● Đang còn phòng trống
                    </p>
                  ) : (
                    <p className="text-[10px] text-rose-400 font-bold uppercase tracking-widest">
                      ✕ Vừa mới hết phòng
                    </p>
                  )}
                </div>

                <button
                  disabled={!isAvailable}
                  className={`relative overflow-hidden group/btn px-12 py-4 rounded-3xl font-black text-sm tracking-widest transition-all duration-300 ${
                    isAvailable
                      ? "bg-gray-900 text-white hover:bg-teal-600 hover:shadow-[0_15px_40px_rgba(20,184,166,0.3)] active:scale-95"
                      : "bg-gray-100 text-gray-300 cursor-not-allowed"
                  }`}
                >
                  <span className="relative z-10">
                    {isAvailable ? "ĐẶT NGAY" : "HẾT PHÒNG"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RoomList;
