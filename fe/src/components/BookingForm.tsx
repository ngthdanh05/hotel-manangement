import { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
export interface RoomSearchRequest {
  ngayNhan: string;
  ngayTra: string;
  soNguoi: number;
}

const BookingForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RoomSearchRequest>({
    ngayNhan: "",
    ngayTra: "",
    soNguoi: 1,
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "soNguoi" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (new Date(formData.ngayNhan) >= new Date(formData.ngayTra)) {
      alert("Ngày trả phải sau ngày nhận!");
      return;
    }

    const queryParams = new URLSearchParams({
      checkIn: formData.ngayNhan,
      checkOut: formData.ngayTra,
      guests: formData.soNguoi.toString(),
    });

    navigate(`/rooms?${queryParams.toString()}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#ffb700] rounded-xl p-2 shadow-lg w-full max-w-xl"
    >
      <div className="bg-white rounded-lg p-4 text-center font-bold text-black text-lg">
        ĐẶT PHÒNG NGAY
      </div>

      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div className="bg-white p-3 rounded flex flex-col gap-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase">
            Ngày nhận
          </label>
          <div className="flex items-center gap-2">
            <span>📅</span>
            <input
              type="date"
              name="ngayNhan"
              className="outline-none text-black w-full text-sm cursor-pointer"
              value={formData.ngayNhan}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="bg-white p-3 rounded flex flex-col gap-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase">
            Ngày trả
          </label>
          <div className="flex items-center gap-2">
            <span>📅</span>
            <input
              type="date"
              name="ngayTra"
              className="outline-none text-black w-full text-sm cursor-pointer"
              value={formData.ngayTra}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="bg-white p-3 rounded flex items-center gap-2 sm:col-span-2">
          <span>👤</span>
          <select
            name="soNguoi"
            className="outline-none w-full text-black bg-transparent cursor-pointer"
            value={formData.soNguoi}
            onChange={handleChange}
          >
            <option value={1}>1 người lớn</option>
            <option value={2}>2 người lớn</option>
            <option value={4}>4 người lớn</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="mt-2 w-full bg-[#0071c2] text-white py-4 rounded-lg font-bold hover:bg-blue-800 transition-all active:scale-[0.98] shadow-md"
      >
        TÌM PHÒNG TRỐNG
      </button>
    </form>
  );
};

export default BookingForm;
