export interface Tour {
  id: number;
  name: string;
  subtitle: string;
  image: string;
  duration: string;
  location: string;
  activities: string[];
}

export const tours: Tour[] = [
  {
    id: 1,
    name: "Hội An",
    subtitle: "Phố cổ, ánh đèn lung linh và ẩm thực đặc sắc",
    image: "/image/hoian.jpg",
    duration: "1 ngày",
    location: "Hội An",
    activities: ["Dạo phố cổ", "Thả đèn hoa đăng", "Ăn cao lầu, mì Quảng"],
  },
  {
    id: 2,
    name: "Đà Nẵng",
    subtitle: "Thành phố của những cây cầu và biển xanh",
    image: "/image/danang.jpg",
    duration: "3 ngày 2 đêm",
    location: "Đà Nẵng",
    activities: [
      "Check-in Cầu Vàng",
      "Tham quan Bà Nà Hills",
      "Tắm biển Mỹ Khê",
    ],
  },

  {
    id: 3,
    name: "Huế",
    subtitle: "Khám phá cố đô mộng mơ, di sản và chiều sâu văn hóa",
    image: "/image/hue.jpg",
    duration: "2 ngày 1 đêm",
    location: "Huế",
    activities: [
      "Tham quan Đại Nội",
      "Chùa Thiên Mụ",
      "Thưởng thức bún bò Huế",
    ],
  },
];
