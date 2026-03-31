import { Tour } from "../data/tours";

const TourCard = ({ tour }: { tour: Tour }) => {
  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition">
      <img src={tour.image} className="h-56 w-full object-cover" />

      <div className="p-5">
        <h3 className="text-xl font-bold text-accent mb-2">{tour.name}</h3>

        <p className="text-gray-300">{tour.duration}</p>

        <p className="text-lg text-yellow-400 font-semibold mt-2">
          {tour.price}
        </p>

        <button className="mt-4 px-4 py-2 bg-gradient-to-r from-red-600 to-yellow-500 rounded-lg text-white">
          Xem chi tiết
        </button>
      </div>
    </div>
  );
};

export default TourCard;
