type StatCardProps = {
  titulo: string;
  valor: string;
  detalle: string;
  tendencia?: string;
};

export default function StatCard({
  titulo,
  valor,
  detalle,
  tendencia,
}: StatCardProps) {
  return (
    <article className="group rounded-2xl border border-slate-300/70 bg-[#E8ECEC] p-5 shadow-lg shadow-black/10 transition-all duration-200 hover:-translate-y-1 hover:border-[#2A9D8F] hover:shadow-xl">

      <div className="mb-5 flex items-start justify-between">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#BFEDE7] text-[#0F766E]">
          <span className="text-lg font-bold">↗</span>
        </div>

        {tendencia && (
          <span className="rounded-full bg-[#D1FAE5] px-2.5 py-1 text-xs font-semibold text-[#047857]">
            {tendencia}
          </span>
        )}

      </div>

      <p className="text-sm font-medium text-slate-600">
        {titulo}
      </p>

      <p className="mt-2 text-2xl font-bold tracking-tight text-[#172021]">
        {valor}
      </p>

      <p className="mt-2 text-xs text-slate-500">
        {detalle}
      </p>

    </article>
  );
}