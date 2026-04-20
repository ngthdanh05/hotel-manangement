import { tours } from "../data/tours";

const TourCard = [...tours]
  .sort((a, b) => a.id - b.id)
  .map((tour) => (
    <div className="group select-none w-full h-full bg-white/10 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl border border-white/10 hover:scale-[1.03] transition duration-500">
      <div className="relative overflow-hidden">
        <img
          src={tour.image}
          className="h-44 sm:h-52 md:h-60 lg:h-64 w-full object-cover group-hover:scale-110 transition duration-700"
        />
      </div>

      <div className="p-4 sm:p-5 md:p-6 flex flex-col gap-2">
        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-yellow-400">
          {tour.name}
        </h3>

        <p className="text-xs md:text-base text-gray-300">{tour.subtitle}</p>

        <div className="flex gap-3 text-xs md:text-base text-gray-400">
          <span>📍 {tour.duration}</span> -<span>{tour.location}</span>
        </div>

        <div className="md:mt-3 border-l border-yellow-500 pl-3">
          {tour.activities.slice(0, 3).map((item, index) => (
            <p key={index} className="text-sm md:text-base text-gray-300">
              • {item}
            </p>
          ))}
        </div>
      </div>
    </div>
  ));

export default TourCard;
