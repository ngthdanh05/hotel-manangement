export interface Tour {
  id: number;
  name: string;
  duration: string;
  price: string;
  image: string;
  itinerary: string[];
}

export const tours: Tour[] = [
  {
    id: 1,
    name: "Một miền di sản",
    duration: "3 ngày 2 đêm",
    price: "6.990.000đ",
    image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482",
    itinerary: [
      "Ngày 1: Hà Nội - Khởi hành",
      "Ngày 2: Huế - Kinh thành",
      "Ngày 3: Hội An - Phố cổ",
      "Ngày 4: Đà Nẵng - Biển",
      "Ngày 5: Kết thúc",
    ],
  },
];
