import { useEffect, useState } from "react";
import httpRequest from "../utils/httpRequest";

export interface RoomType {
  MaLoaiPhong: number;
  TenLoai: string;
  MoTa: string;
  Gia: number;
  SoNguoi: number;
}

// Map ảnh theo dữ liệu thực tế từ ảnh bạn gửi
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

// Các tiện ích để card đầy đặn hơn
const AMENITIES_MAP: Record<string, string[]> = {
  "Phòng bình dân": ["Wifi", "Quạt máy", "Tủ lạnh nhỏ"],
  "Phòng VIP 1": ["Free Wifi", "Điều hòa", "Bồn tắm", "View phố"],
  "Phòng VIP 2": ["Smart TV", "Ban công", "Buffet sáng", "Minibar"],
  "Phòng VIP 3": ["Hồ bơi riêng", "Phục vụ 24/7", "View biển", "Xe đưa đón"],
  "Phòng đơn": ["Wifi", "Bàn làm việc", "Cửa sổ"],
  Default: ["Dịch vụ cơ bản"],
};

interface RoomTypeCardProps {
  render: (cards: React.ReactNode[], loading: boolean) => React.ReactNode;
}

const RoomTypeCard = ({ render }: RoomTypeCardProps) => {
  const [data, setData] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await httpRequest("/room-types");
        setData(res.data.data);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const cardElements = data.map((room) => {
    const roomImage = ROOM_IMAGES[room.TenLoai] || ROOM_IMAGES["Default"];
    const amenities = AMENITIES_MAP[room.TenLoai] || AMENITIES_MAP["Default"];

    return (
      <div
        key={room.MaLoaiPhong}
        className="group w-full h-full bg-white/10 backdrop-blur-2xl rounded-3xl overflow-hidden shadow-2xl border border-white/20 flex flex-col transition-all duration-300"
      >
        <div className="relative h-4/8 overflow-hidden">
          <img
            src={roomImage}
            alt={room.TenLoai}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-yellow-400 uppercase tracking-widest border border-white/20">
            {room.TenLoai.includes("VIP") ? "⭐ Premium" : "Standard"}
          </div>
        </div>

        <div className="p-5 flex flex-col gap-3 flex-1">
          <div className="flex justify-between items-start">
            <h3 className="text-2xl font-bold text-white group-hover:text-yellow-400 transition-colors">
              {room.TenLoai}
            </h3>
            <span className="bg-orange-500/20 text-gray-50 px-2 py-0.5 rounded-lg border border-orange-500/30">
              {room.SoNguoi} người
            </span>
          </div>

          <p className=" text-gray-200 line-clamp-2 leading-relaxed">
            {room.MoTa}
          </p>

          <div className="flex flex-wrap gap-2 mt-1">
            {amenities.map((item, index) => (
              <span
                key={index}
                className="text-[12px] text-gray-300 bg-white/5 px-2 py-1 rounded-md border border-white/5"
              >
                • {item}
              </span>
            ))}
          </div>

          {/* PRICE SECTION */}
          <div className="mt-auto pt-4 border-t border-white/10 flex justify-between items-end">
            <div>
              <p className="text-orange-500 font-semibold uppercase tracking-tighter">
                Giá mỗi đêm :
              </p>
              <p className="text-xl font-black text-yellow-400">
                {Number(room.Gia).toLocaleString()}đ
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  });

  return <>{render(cardElements, loading)}</>;
};

export default RoomTypeCard;
