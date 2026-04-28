import { useEffect, useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Home, Users, CalendarCheck, DollarSign } from "lucide-react";
import httpRequest from "../../utils/httpRequest";

interface MonthlyRevenue {
  month: string;
  revenue: number;
  transactions: number;
}

interface DashboardData {
  totalRooms: number;
  totalCustomers: number;
  totalOrders: number;
  totalRevenue: number;
  monthlyRevenue: MonthlyRevenue[];
}

const Dashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(new Date().getFullYear());
  const [error, setError] = useState<string | null>(null);

  console.log(year);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await httpRequest.get(`/admin/dashboard?year=${year}`);
        setData(res.data.data);
      } catch (err) {
        setError("Không thể tải dữ liệu dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [year]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);

  const growth = useMemo(() => {
    if (!data?.monthlyRevenue) return 0;

    const arr = data.monthlyRevenue;
    if (arr.length < 2) return 0;

    const last = arr[arr.length - 1].revenue;
    const prev = arr[arr.length - 2].revenue;

    if (prev === 0) return 0;

    return ((last - prev) / prev) * 100;
  }, [data]);

  const statCards = useMemo(() => {
    if (!data) return [];

    return [
      {
        title: "Tổng Số Phòng",
        value: data.totalRooms,
        icon: Home,
        color: "text-blue-600",
        bgColor: "bg-blue-100",
      },
      {
        title: "Khách Hàng",
        value: data.totalCustomers,
        icon: Users,
        color: "text-green-600",
        bgColor: "bg-green-100",
      },
      {
        title: "Lượt Đặt Phòng",
        value: data.totalOrders,
        icon: CalendarCheck,
        color: "text-purple-600",
        bgColor: "bg-purple-100",
      },
      {
        title: "Doanh Thu",
        value: formatCurrency(data.totalRevenue),
        icon: DollarSign,
        color: "text-rose-600",
        bgColor: "bg-rose-100",
      },
    ];
  }, [data]);

  // ================= UI =================

  if (loading) {
    return (
      <div className="p-6 animate-pulse space-y-6">
        <div className="h-8 bg-slate-200 rounded w-1/3" />
        <div className="grid grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-200 rounded-2xl" />
          ))}
        </div>
        <div className="h-80 bg-slate-200 rounded-2xl" />
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-red-500 font-medium">{error}</div>;
  }

  if (!data) {
    return <div className="p-6">Không có dữ liệu</div>;
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen select-none">
      {/* HEADER */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Dashboard Khách Sạn
          </h1>
          <p className="text-slate-500">Tổng quan & hiệu suất kinh doanh</p>
        </div>

        {/* FILTER YEAR */}
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="text-gray-800 border rounded-lg px-4 py-2"
        >
          {[2023, 2024, 2025, 2026, 2027].map((y) => (
            <option key={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-slate-500">{card.title}</p>
                  <h3 className="text-2xl font-bold text-gray-800">
                    {card.value}
                  </h3>
                </div>
                <div className={`p-3 rounded-full ${card.bgColor}`}>
                  <Icon className={`w-6 h-6 ${card.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CHART */}
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <div className="flex justify-between mb-4">
          <h2 className="font-bold">Doanh thu theo tháng</h2>

          {/* Insight */}
          <span
            className={`text-sm font-bold ${
              growth >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {growth >= 0 ? "↑" : "↓"} {growth.toFixed(1)}%
          </span>
        </div>

        <div className="h-80">
          {data.monthlyRevenue.length === 0 ? (
            <div className="flex items-center justify-center h-full text-slate-400">
              Không có dữ liệu
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.monthlyRevenue}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(v) => `${v / 1}M`} />
                <Tooltip
                  formatter={(value) =>
                    typeof value === "number" ? formatCurrency(value) : value
                  }
                />

                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#4f46e5"
                  fill="url(#colorRevenue)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
