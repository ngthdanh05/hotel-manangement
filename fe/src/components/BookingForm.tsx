import { useState, ChangeEvent, FormEvent } from "react";

export interface RoomSearchRequest {
  ngayNhan: string;
  ngayTra: string;
  soNguoi: number;
}

const BookingForm = () => {
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (new Date(formData.ngayNhan) >= new Date(formData.ngayTra)) {
      alert("Ngày trả phải sau ngày nhận!");
      return;
    }

    console.log("Gửi yêu cầu tìm phòng:", formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="
        bg-[#ffb700] 
        rounded-xl 
        p-2 
        shadow-lg 
        w-full
        max-w-xl
      "
    >
      <div className="bg-white rounded-lg p-4 text-center font-bold text-black text-lg">
        ĐẶT PHÒNG NGAY
      </div>

      {/* GRID responsive */}
      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
        {/* Date */}
        <div className="bg-white p-3 rounded flex items-center gap-2">
          <span>📅</span>
          <input
            type="date"
            name="ngayNhan"
            className="outline-none text-black w-full text-sm"
            value={formData.ngayNhan}
            onChange={handleChange}
            required
          />
        </div>

        <div className="bg-white p-3 rounded flex items-center gap-2">
          <span>📅</span>
          <input
            type="date"
            name="ngayTra"
            className="outline-none text-black w-full text-sm"
            value={formData.ngayTra}
            onChange={handleChange}
            required
          />
        </div>

        {/* Guest */}
        <div className="bg-white p-3 rounded flex items-center gap-2 sm:col-span-2">
          <span>👤</span>
          <select
            name="soNguoi"
            className="outline-none w-full text-black"
            value={formData.soNguoi}
            onChange={handleChange}
          >
            <option value={1}>1 người lớn</option>
            <option value={2}>2 người lớn</option>
            <option value={4}>4 người lớn</option>
          </select>
        </div>
      </div>

      {/* Button */}
      <button
        type="submit"
        className="
          mt-2 w-full 
          bg-[#0071c2] 
          text-white 
          py-3 
          rounded-lg 
          font-semibold 
          hover:bg-blue-700 
          transition
        "
      >
        Tìm phòng
      </button>
    </form>
  );
};

export default BookingForm;
