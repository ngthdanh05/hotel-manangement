import { Link } from "react-router-dom";
import Stack from "./Stack";
import TourCard from "./TourCard";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col bg-black text-white overflow-hidden select-none">
      <div className="absolute inset-0 bg-hero-gradient blur-3xl opacity-50" />
      <div className="wave opacity-20" />

      <div className="absolute inset-0 bg-hero-gradient blur-3xl opacity-40" />

      <div className="relative z-10 flex flex-col min-h-screen max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center pt-28 sm:pt-32 md:pt-40 pb-20">
          <div className="text-center md:text-left flex flex-col gap-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
              <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 text-transparent bg-clip-text">
                Nơi Nghỉ Dưỡng
              </span>
              <br />
              <span className="text-white">Đẳng Cấp Tinh Hoa</span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed max-w-xl mx-auto md:mx-0">
              Hệ thống đặt phòng thông minh giúp bạn tìm kiếm những không gian
              sống sang trọng, ấm cúng và đầy đủ tiện nghi chỉ trong vài giây.
            </p>

            <div className="flex gap-4 flex-wrap justify-center md:justify-start">
              <Link
                to="/booking"
                className="bg-white text-black px-8 py-4 rounded-xl font-bold hover:scale-105 transition-transform"
              >
                Đặt phòng ngay
              </Link>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex justify-center md:justify-end">
            <div className="w-[280px] sm:w-[320px] md:w-[360px] lg:w-[440px] h-[360px] sm:h-[390px] md:h-[480px] lg:h-[530px]">
              <Stack
                cards={TourCard}
                autoplay
                autoplayDelay={3000}
                pauseOnHover
                randomRotation
                sendToBackOnClick
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
