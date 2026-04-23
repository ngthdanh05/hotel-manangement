import Stack from "./Stack";
import BookingForm from "./BookingForm";
import RoomTypeCard from "./RoomTypeCard";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col bg-black text-white overflow-hidden select-none">
      {/* BACKGROUND LAYERS */}
      <div className="absolute inset-0 bg-hero-gradient blur-3xl opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#ffb70020] via-transparent to-[#0071c220]" />
      <div className="wave opacity-20" />

      <div className="relative z-10 flex flex-col min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-12 items-center pt-28 pb-20">
          {/* LEFT */}
          <div className="flex flex-col gap-6 text-center md:text-left">
            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[58px] font-extrabold leading-tight">
              Trải nghiệm kỳ nghỉ
              <br />
              <span className="bg-gradient-to-r from-[#ffb700] to-orange-400 bg-clip-text text-transparent">
                theo cách của bạn
              </span>
            </h1>

            {/* Description */}
            <p className="text-gray-400 text-lg max-w-xl mx-auto md:mx-0">
              Đặt phòng khách sạn và những trải nghiệm tuyệt vời với giá tốt
              nhất. Nhanh chóng, dễ dàng và an toàn.
            </p>

            {/* FORM (Glass effect) */}
            <div className="pt-4">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-2 shadow-xl">
                <BookingForm />
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex justify-center md:justify-end relative">
            {/* Glow behind cards */}
            <div className="absolute w-[300px] h-[300px] bg-[#ffb700] blur-[120px] opacity-30 rounded-full" />

            <div className="relative w-[280px] sm:w-[320px] md:w-[380px] lg:w-[450px] h-[360px] sm:h-[420px] md:h-[500px]">
              <RoomTypeCard
                render={(cards, loading) =>
                  loading ? (
                    <div className="w-full h-full bg-white/5 animate-pulse rounded-2xl flex items-center justify-center">
                      <span className="text-gray-400">Đang tải phòng...</span>
                    </div>
                  ) : (
                    <Stack
                      cards={cards}
                      autoplay
                      autoplayDelay={3000}
                      pauseOnHover
                      randomRotation
                      sendToBackOnClick
                    />
                  )
                }
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
