import { useEffect, useState } from "react";
import httpRequest from "../utils/httpRequest";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faHashtag,
  faUser,
  faBed,
  faArrowRight,
  faCircleNotch,
  faPhone,
  faInfoCircle,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

interface Booking {
  MaDatPhong: number;
  HoTen: string;
  SoDienThoai: string;
  SoPhong: string;
  TenLoai: string;
  NgayNhanPhong: string;
  NgayTraPhong: string;
  SoNgay: number;
  Gia: number;
  TongTien: number;
  TrangThai: "da_dat" | "da_nhan_phong" | "da_thanh_toan" | "da_huy";
}

const BookingHistory = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // State quản lý Modal chi tiết
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await httpRequest.get("/bookings/history");
        if (res.data.success) {
          setBookings(res.data.data);
        }
      } catch (error: any) {
        toast.error("Không thể tải lịch sử đặt phòng");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "da_dat":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "da_nhan_phong":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "da_thanh_toan":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "da_huy":
        return "bg-rose-500/10 text-rose-500 border-rose-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  const handleOpenDetail = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <FontAwesomeIcon
          icon={faCircleNotch}
          spin
          className="text-[#c8a96e] text-4xl"
        />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-black text-white overflow-hidden select-none">
      <div className="absolute inset-0 bg-hero-gradient blur-3xl opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#ffb70020] via-transparent to-[#0071c220]" />
      <div className="wave opacity-20" />

      <div className="max-w-6xl mx-auto mt-28 z-10">
        <header className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-[2px] w-12 bg-[#c8a96e]"></div>
            <p className="text-[#c8a96e] font-bold tracking-[0.4em] uppercase text-[10px]">
              Your Journey
            </p>
          </div>
          <h1 className="text-6xl font-black uppercase tracking-tighter">
            Lịch sử{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c8a96e] via-[#f3d9a2] to-[#c8a96e]">
              đặt phòng
            </span>
          </h1>
        </header>

        {bookings.length === 0 ? (
          <div className="py-32 text-center border border-white/5 rounded-[4rem] bg-white/[0.01] backdrop-blur-sm">
            <FontAwesomeIcon
              icon={faCalendarAlt}
              className="text-gray-800 text-5xl mb-6"
            />
            <p className="text-gray-500 text-lg">
              Bạn chưa có chuyến đi nào cùng PeakStay
            </p>
          </div>
        ) : (
          <div className="grid gap-10 mb-20">
            {bookings.map((booking) => (
              <div
                key={booking.MaDatPhong}
                className="group relative bg-[#111111] border border-white/5 rounded-[3rem] p-10 hover:border-[#c8a96e]/40 transition-all duration-700 overflow-hidden"
              >
                {/* ID mờ phía sau */}
                <div className="absolute -bottom-4 -right-2 text-white/[0.02] text-9xl font-black italic select-none">
                  {booking.MaDatPhong}
                </div>

                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12 relative z-10">
                  <div className="space-y-6 flex-1">
                    <div className="flex items-center gap-4">
                      <span
                        className={`px-5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(booking.TrangThai)}`}
                      >
                        {booking.TrangThai.replace("_", " ")}
                      </span>
                    </div>

                    <div>
                      <h2 className="text-4xl font-black text-white uppercase mb-3 leading-none group-hover:text-[#c8a96e] transition-colors">
                        {booking.TenLoai}
                      </h2>
                      <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 font-medium">
                        <span className="flex items-center gap-2 underline underline-offset-4 decoration-[#c8a96e]/30">
                          <FontAwesomeIcon icon={faUser} className="text-xs" />{" "}
                          {booking.HoTen}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-10 bg-white/[0.02] py-8 px-12 rounded-[2rem] border border-white/5 group-hover:bg-white/[0.04] transition-all">
                    <div className="text-center">
                      <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2">
                        Ngày nhận
                      </p>
                      <p className="text-xl font-black tracking-tight">
                        {new Date(booking.NgayNhanPhong).toLocaleDateString(
                          "vi-VN",
                        )}
                      </p>
                    </div>

                    <FontAwesomeIcon
                      icon={faArrowRight}
                      className="text-[#c8a96e]/40 group-hover:translate-x-1 transition-transform"
                    />

                    <div className="text-center">
                      <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2">
                        Ngày trả
                      </p>
                      <p className="text-xl font-black tracking-tight">
                        {new Date(booking.NgayTraPhong).toLocaleDateString(
                          "vi-VN",
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="text-right min-w-[220px]">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-2">
                      {booking.SoNgay} Đêm lưu trú
                    </p>
                    <p className="text-5xl font-black tracking-tighter text-white mb-4">
                      {Number(booking.TongTien).toLocaleString("vi-VN")}
                      <span className="text-2xl font-light ml-2 text-gray-500">
                        đ
                      </span>
                    </p>

                    {/* Nút Xem chi tiết */}
                    <button
                      onClick={() => handleOpenDetail(booking)}
                      className="text-[10px] font-black uppercase tracking-widest text-[#c8a96e] hover:text-white transition-colors flex items-center gap-2 ml-auto"
                    >
                      Chi tiết <FontAwesomeIcon icon={faInfoCircle} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
            onClick={() => setIsModalOpen(false)}
          ></div>
          {/* Card Modal */}
          <div className="relative bg-[#0d0d0d] border border-white/10 w-full max-w-2xl rounded-[3.5rem] overflow-hidden shadow-[0_0_50px_rgba(200,169,110,0.1)] z-10">
            <div className="p-12">
              <div className="flex justify-between items-start mb-10">
                <div>
                  <h2 className="text-[#c8a96e] text-4xl font-black uppercase tracking-tighter">
                    Thông tin chi tiết
                  </h2>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-8">
                  <div className="flex items-start gap-4 mt-6">
                    <div className="w-10 h-10 rounded-2xl bg-[#c8a96e]/10 flex items-center justify-center text-[#c8a96e]">
                      <FontAwesomeIcon icon={faUser} />
                    </div>
                    <div>
                      <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest mb-1">
                        Khách hàng
                      </p>
                      <p className="font-bold text-lg">
                        {selectedBooking.HoTen}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-[#c8a96e]/10 flex items-center justify-center text-[#c8a96e]">
                      <FontAwesomeIcon icon={faPhone} />
                    </div>
                    <div>
                      <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest mb-1">
                        Liên hệ
                      </p>
                      <p className="font-bold text-lg">
                        {selectedBooking.SoDienThoai}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-[#c8a96e]/10 flex items-center justify-center text-[#c8a96e]">
                      <FontAwesomeIcon icon={faBed} />
                    </div>
                    <div>
                      <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest mb-1">
                        Không gian
                      </p>
                      <p className="font-bold text-lg text-[#c8a96e]">
                        {selectedBooking.TenLoai} - Phòng{" "}
                        {selectedBooking.SoPhong}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/[0.02] p-8 rounded-[2.5rem] border border-white/5 space-y-6">
                  <div>
                    <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest mb-2">
                      Hành trình
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="font-bold">
                        {new Date(
                          selectedBooking.NgayNhanPhong,
                        ).toLocaleDateString("vi-VN")}
                      </span>
                      <FontAwesomeIcon
                        icon={faArrowRight}
                        className="text-[#c8a96e] text-xs"
                      />
                      <span className="font-bold">
                        {new Date(
                          selectedBooking.NgayTraPhong,
                        ).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 italic">
                      {selectedBooking.SoNgay} đêm nghỉ dưỡng
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest mb-2">
                      Đơn giá/đêm
                    </p>
                    <p className="font-bold">
                      {Number(selectedBooking.Gia).toLocaleString("vi-VN")} đ
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/5">
                    <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest mb-2">
                      Tổng thanh toán
                    </p>
                    <p className="text-3xl font-black text-[#c8a96e]">
                      {Number(selectedBooking.TongTien).toLocaleString("vi-VN")}{" "}
                      <span className="text-xl">đ</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingHistory;
