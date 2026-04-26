import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/auth/AuthContext";
import httpRequest from "../utils/httpRequest";

const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { room, checkIn, checkOut } = location.state || {};

  const [dates, setDates] = useState({
    checkIn: checkIn || "",
    checkOut: checkOut || "",
  });
  const [cccd, setCccd] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculateNights = () => {
    if (!dates.checkIn || !dates.checkOut) return 1;
    const start = new Date(dates.checkIn);
    const end = new Date(dates.checkOut);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!dates.checkIn || !dates.checkOut)
      return toast.warning("Vui lòng chọn ngày lưu trú");
    if (new Date(dates.checkIn) >= new Date(dates.checkOut))
      return toast.error("Ngày trả phải sau ngày nhận");
    if (!cccd) return toast.warning("Vui lòng nhập số CCCD để hoàn tất");

    setIsSubmitting(true);
    try {
      const res = await httpRequest.post("/bookings/finalize", {
        cccd,
        maLoaiPhong: room.MaLoaiPhong,
        ngayNhan: dates.checkIn,
        ngayTra: dates.checkOut,
        tongTien: Number(room.Gia) * calculateNights(),
      });

      if (res.data.success) {
        toast.success("Đặt phòng thành công!");
        navigate("/history");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Loại phòng này hiện đã hết chỗ trong thời gian bạn chọn",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!room)
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-[#0a0a0a]">
        <p className="animate-pulse">Đang tải dữ liệu phòng...</p>
      </div>
    );

  return (
    <div className="relative min-h-screen flex flex-col bg-black text-white overflow-hidden select-none">
      <div className="absolute inset-0 bg-hero-gradient blur-3xl opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#ffb70020] via-transparent to-[#0071c220]" />
      <div className="wave opacity-20" />

      <div className="max-w-6xl mx-auto mt-28">
        <header className="mb-12">
          <h1 className="text-5xl font-black tracking-tighter uppercase mb-2">
            Xác nhận <span className="text-[#c8a96e]">đặt chỗ</span>
          </h1>
          <p className="text-gray-500 font-medium">
            Bạn chỉ còn một bước nữa để hoàn tất kỳ nghỉ tại PeakStay.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-8 rounded-[2rem] shadow-xl">
              <div className="flex items-center gap-4 mb-8">
                <span className="w-10 h-10 rounded-xl bg-[#c8a96e] text-black flex items-center justify-center font-bold">
                  01
                </span>
                <h2 className="text-xl font-bold uppercase tracking-widest">
                  Thời gian lưu trú
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                    Ngày nhận phòng
                  </label>
                  <input
                    type="date"
                    value={dates.checkIn}
                    onChange={(e) =>
                      setDates({ ...dates, checkIn: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-[#c8a96e] transition-all [color-scheme:dark]"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                    Ngày trả phòng
                  </label>
                  <input
                    type="date"
                    value={dates.checkOut}
                    onChange={(e) =>
                      setDates({ ...dates, checkOut: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-[#c8a96e] transition-all [color-scheme:dark]"
                  />
                </div>
              </div>
            </section>

            <section className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-8 rounded-[2rem] shadow-xl">
              <div className="flex items-center gap-4 mb-8">
                <span className="w-10 h-10 rounded-xl bg-gray-800 text-white flex items-center justify-center font-bold">
                  02
                </span>
                <h2 className="text-xl font-bold uppercase tracking-widest">
                  Thông tin người đặt
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3 opacity-60">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    value={user?.name || ""}
                    disabled
                    className="w-full bg-black/40 border border-white/5 p-5 rounded-2xl cursor-not-allowed"
                  />
                </div>
                <div className="space-y-3 opacity-60">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                    Số điện thoại
                  </label>
                  <input
                    type="text"
                    value={user?.phone || ""}
                    disabled
                    className="w-full bg-black/40 border border-white/5 p-5 rounded-2xl cursor-not-allowed"
                  />
                </div>
                <div className="md:col-span-2 space-y-3">
                  <label className="text-[10px] font-black text-[#c8a96e] uppercase tracking-[0.2em]">
                    Số CCCD *
                  </label>
                  <input
                    type="text"
                    value={cccd}
                    onChange={(e) => setCccd(e.target.value)}
                    placeholder="Nhập số CCCD để làm thủ tục nhận phòng"
                    className="w-full bg-[#c8a96e]/5 border border-[#c8a96e]/30 p-5 rounded-2xl text-[#c8a96e] outline-none focus:bg-[#c8a96e]/10 transition-all placeholder:text-[#c8a96e]/30"
                  />
                </div>
              </div>
            </section>
          </div>

          <aside className="lg:col-span-1">
            <div className="bg-[#c8a96e] p-10 rounded-[3rem] text-black sticky top-32 shadow-[0_30px_60px_-15px_rgba(200,169,110,0.3)] overflow-hidden">
              <div className="absolute -right-4 -top-4 text-black/5 text-9xl font-black italic">
                LS
              </div>

              <h2 className="text-3xl font-black mb-8 uppercase leading-tight italic">
                Chi tiết
                <br />
                Hóa đơn
              </h2>

              <div className="space-y-5 mb-10 border-b border-black/10 pb-8">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-bold uppercase opacity-50">
                    Loại phòng
                  </span>
                  <span className="font-black text-lg">{room.TenLoai}</span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-xs font-bold uppercase opacity-50">
                    Đơn giá
                  </span>
                  <span className="font-black">
                    {Number(room.Gia).toLocaleString()} đ/đêm
                  </span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-xs font-bold uppercase opacity-50">
                    Thời gian
                  </span>
                  <span className="font-black">{calculateNights()} đêm</span>
                </div>
              </div>

              <div className="flex flex-col gap-1 mb-10">
                <span className="text-xs font-black uppercase tracking-widest opacity-50">
                  Tổng thanh toán:
                </span>
                <span className="text-5xl font-black tracking-tighter">
                  {(Number(room.Gia) * calculateNights()).toLocaleString()}{" "}
                  <span className="text-xl">đ</span>
                </span>
              </div>

              <button
                onClick={handleConfirmBooking}
                disabled={isSubmitting}
                className="w-full bg-black text-white font-black py-6 rounded-[2rem] hover:scale-[1.03] active:scale-95 transition-all shadow-2xl disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "HOÀN TẤT ĐẶT PHÒNG"
                )}
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
