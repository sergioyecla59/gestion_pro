"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const ventas = [
  { mes: "Ene", total: 12800 },
  { mes: "Feb", total: 15400 },
  { mes: "Mar", total: 14200 },
  { mes: "Abr", total: 18900 },
  { mes: "May", total: 17600 },
  { mes: "Jun", total: 22100 },
  { mes: "Jul", total: 24580 },
];

export default function SalesChart() {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#E8ECEC] p-5 shadow-xl shadow-black/10">

      {/* CABECERA */}
      <div className="flex items-center justify-between">

        <div>
          <h2 className="text-base font-bold text-[#1C2526]">
            Evolución de ventas
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Rendimiento de los últimos 7 meses
          </p>
        </div>

        <div className="flex items-center gap-3">

          <span className="rounded-lg bg-[#BFEDE7] px-3 py-1.5 text-xs font-semibold text-[#0F766E]">
            +12,5%
          </span>

          <button className="text-xs font-semibold text-[#0F766E] transition hover:text-[#115E59]">
            Ver informe →
          </button>

        </div>

      </div>

      {/* GRÁFICO */}
      <div className="mt-4 h-[175px] w-full">

        <ResponsiveContainer width="100%" height="100%">

          <AreaChart
            data={ventas}
            margin={{
              top: 10,
              right: 10,
              left: -15,
              bottom: 0,
            }}
          >

            <defs>
              <linearGradient
                id="ventasGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="#0F766E"
                  stopOpacity={0.30}
                />

                <stop
                  offset="95%"
                  stopColor="#0F766E"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#CBD5E1"
            />

            <XAxis
              dataKey="mes"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#64748B",
                fontSize: 11,
              }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#64748B",
                fontSize: 10,
              }}
              tickFormatter={(valor) => `${valor / 1000}k`}
            />

            <Tooltip
              formatter={(valor) => [
                `${Number(valor).toLocaleString("es-ES")} €`,
                "Ventas",
              ]}
              contentStyle={{
                borderRadius: "10px",
                border: "1px solid #CBD5E1",
                fontSize: "12px",
              }}
            />

            <Area
              type="monotone"
              dataKey="total"
              stroke="#0F766E"
              strokeWidth={3}
              fill="url(#ventasGradient)"
              activeDot={{
                r: 5,
                fill: "#0F766E",
              }}
            />

          </AreaChart>

        </ResponsiveContainer>

      </div>

    </section>
  );
}