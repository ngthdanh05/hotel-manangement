import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Search, LogIn, CreditCard, XCircle, RefreshCw } from "lucide-react";
import httpRequest from "../../utils/httpRequest";

type BookingStatus = "da_dat" | "dang_o" | "da_tra" | "da_huy";

interface IBooking {
  MaDatPhong: number;
  HoTen: string;
  SoDienThoai: string;
  CCCD: string;
  SoPhong: string;
  TenLoai: string;
  NgayNhanPhong: string;
  NgayTraPhong: string;
  SoNgay: number;
  Gia: number;
  TongTien: number;
  TrangThai: BookingStatus;
}

const BookingAdminPage = () => {
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await httpRequest.get("/admin/bookings");
      setBookings(res.data.data);
    } catch {
      toast.error("Lỗi khi tải danh sách đặt phòng");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (booking: IBooking, status: BookingStatus) => {
    const confirmMap = {
      dang_o: "Xác nhận khách nhận phòng?",
      da_tra: "Xác nhận thanh toán và trả phòng?",
      da_huy: "Bạn có chắc chắn muốn hủy đơn này?",
      da_dat: "Khôi phục đơn đặt?",
    };

    if (!window.confirm(confirmMap[status])) return;

    try {
      const res = await httpRequest.put(
        `/admin/bookings/${booking.MaDatPhong}`,
        { status },
      );

      if (res.data.success || res.status === 200) {
        toast.success("Cập nhật trạng thái thành công!");

        setBookings((prev) =>
          prev.map((b) =>
            b.MaDatPhong === booking.MaDatPhong
              ? { ...b, TrangThai: status }
              : b,
          ),
        );

        if (status === "da_tra") {
          setSelectedInvoice({
            ...booking,
            ...res.data.invoice,
            TrangThai: "da_tra",
          });
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("vi-VN");

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  const getStatusBadge = (status: BookingStatus) => {
    const styles = {
      da_dat: "bg-blue-100 text-blue-700",
      dang_o: "bg-orange-100 text-orange-700",
      da_tra: "bg-green-100 text-green-700",
      da_huy: "bg-red-100 text-red-700",
    };

    const labels = {
      da_dat: "Đã đặt",
      dang_o: "Đang ở",
      da_tra: "Đã thanh toán",
      da_huy: "Đã hủy",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status]}`}
      >
        {labels[status]}
      </span>
    );
  };

  const filteredBookings = bookings.filter(
    (b) =>
      b.HoTen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.SoPhong.includes(searchTerm) ||
      b.SoDienThoai.includes(searchTerm),
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-800" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm..."
              className="pl-10 pr-4 py-2 border rounded-lg text-gray-800"
            />
          </div>

          <button
            onClick={fetchBookings}
            className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg text-gray-800"
          >
            <RefreshCw className={loading ? "animate-spin" : ""} />
            Làm mới
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 text-gray-800">
            <tr>
              <th className="p-4">Mã</th>
              <th className="p-4">Khách</th>
              <th className="p-4">Phòng</th>
              <th className="p-4">Ngày</th>
              <th className="p-4">Tiền</th>
              <th className="p-4">Trạng thái</th>
              <th className="p-4 text-center">Hành động</th>
            </tr>
          </thead>

          <tbody>
            {filteredBookings.map((item) => (
              <tr key={item.MaDatPhong} className="border-b text-gray-800">
                <td className="p-4">#{item.MaDatPhong}</td>

                <td className="p-4">
                  <p>{item.HoTen}</p>
                  <p className="text-xs text-gray-800">{item.SoDienThoai}</p>
                  <p className="text-xs text-gray-800">{item.CCCD}</p>
                </td>

                <td className="p-4">
                  {item.SoPhong} ({item.TenLoai})
                </td>

                <td className="p-4 text-sm">
                  {formatDate(item.NgayNhanPhong)} →{" "}
                  {formatDate(item.NgayTraPhong)}
                </td>

                <td className="p-4 font-semibold">
                  {formatCurrency(item.TongTien)}
                </td>

                <td className="p-4">{getStatusBadge(item.TrangThai)}</td>

                {/* ACTION */}
                <td className="p-4 text-center">
                  <div className="flex justify-center gap-2">
                    {item.TrangThai === "da_dat" && (
                      <div className="flex gap-4">
                        <div className="relative group hover:text-green-500">
                          <button onClick={() => updateStatus(item, "dang_o")}>
                            <LogIn />
                          </button>
                          <span className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap transition-all duration-200">
                            Nhận phòng
                          </span>
                        </div>
                        <div className="relative group hover:text-red-500">
                          <button onClick={() => updateStatus(item, "da_huy")}>
                            <XCircle />
                          </button>
                          <span className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap transition-all duration-200">
                            Hủy Phòng
                          </span>
                        </div>
                      </div>
                    )}

                    {item.TrangThai === "dang_o" && (
                      <div className="relative group hover:text-blue-500">
                        <button onClick={() => updateStatus(item, "da_tra")}>
                          <CreditCard />
                        </button>
                        <span className="absolute bottom-[-28px] left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap transition-all duration-200">
                          Thanh Toán
                        </span>
                      </div>
                    )}

                    {item.TrangThai === "da_tra" && (
                      <button
                        onClick={() => setSelectedInvoice(item)}
                        className="text-blue-500 hover:underline"
                      >
                        Xem bill
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-[400px] text-gray-800">
            <h2 className="text-xl font-bold mb-4">Hóa đơn</h2>

            <p>Khách: {selectedInvoice.HoTen}</p>
            <p>Phòng: {selectedInvoice.SoPhong}</p>
            <p>Số đêm: {selectedInvoice.SoNgay}</p>

            <p className="mt-4 font-bold">
              Tổng: {formatCurrency(selectedInvoice.TongTien)}
            </p>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => window.print()}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                In
              </button>

              <button
                onClick={() => setSelectedInvoice(null)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingAdminPage;
