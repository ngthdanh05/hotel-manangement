import RoomSidebar from "../components/layout/RoomSideBar";
import RoomList from "../components/RoomList";

export default function RoomsPage() {
  return (
    <section className="relative min-h-screen flex flex-col bg-black text-white overflow-hidden select-none">
      <div className="absolute inset-0 bg-hero-gradient blur-3xl opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#ffb70020] via-transparent to-[#0071c220]" />
      <div className="wave opacity-20" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
          <div>
            <RoomSidebar />
          </div>

          <main className="lg:col-span-3">
            <RoomList />
          </main>
        </div>
      </div>
    </section>
  );
}
