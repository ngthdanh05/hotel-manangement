import { tours } from "../data/tours";

const Hero = () => {
  const tour = tours[0];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-black text-white">
      {/* Background */}
      <div className="absolute inset-0 bg-hero-gradient blur-3xl opacity-50" />
      <div className="wave opacity-20" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-center py-16 md:py-0">
        {/* LEFT */}
        <div className="text-center md:text-left">
          <h2 className="text-xs sm:text-sm md:text-base text-yellow-400 tracking-widest mb-3 sm:mb-4 uppercase">
            Ba Miền Một Việt
          </h2>

          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold leading-tight mb-4 sm:mb-6">
            <span className="bg-gradient-to-r from-red-700 via-orange-500 to-yellow-400 text-transparent bg-clip-text">
              Một miền di sản
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-gray-300 mb-4 sm:mb-6 leading-relaxed max-w-xl mx-auto md:mx-0">
            Hành trình khám phá vẻ đẹp văn hóa, lịch sử và thiên nhiên Việt Nam
            — nơi mỗi điểm đến là một câu chuyện, mỗi ký ức đều ngân vang theo
            thời gian.
          </p>

          <p className="italic text-orange-400 text-base sm:text-lg md:text-xl mb-6 sm:mb-8">
            “Hồi ức ngân vang”
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start">
            <button className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-red-700 to-yellow-500 rounded-full shadow-lg hover:scale-105 transition">
              Khám phá ngay
            </button>

            <button className="w-full sm:w-auto px-5 py-3 border border-yellow-400 rounded-full hover:bg-yellow-400 hover:text-black transition">
              Xem lịch trình
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="relative flex justify-center">
          {/* Glow */}
          <div className="absolute w-[250px] h-[250px] sm:w-[300px] sm:h-[300px] md:w-[350px] md:h-[350px] bg-gradient-to-tr from-red-600/30 to-yellow-400/20 blur-3xl rounded-full" />

          {/* Card */}
          <div className="relative w-full max-w-sm sm:max-w-md bg-white/5 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl hover:scale-105 transition duration-500">
            <img
              src={tour.image}
              className="h-48 sm:h-56 md:h-64 w-full object-cover"
            />

            <div className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-yellow-400 mb-2">
                {tour.name}
              </h3>

              <p className="text-sm sm:text-base text-gray-300">
                {tour.duration}
              </p>

              <p className="text-base sm:text-lg text-yellow-300 font-semibold mt-2">
                {tour.price}
              </p>

              {/* Timeline */}
              <div className="mt-3 sm:mt-4 border-l border-yellow-500 pl-3 sm:pl-4">
                {tour.itinerary.slice(0, 3).map((day, index) => (
                  <p
                    key={index}
                    className="text-xs sm:text-sm text-gray-300 mb-1"
                  >
                    {day}
                  </p>
                ))}
              </div>

              <button className="mt-4 sm:mt-5 w-full py-2 bg-gradient-to-r from-red-600 to-yellow-500 rounded-lg hover:scale-105 transition">
                Đặt tour ngay
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
