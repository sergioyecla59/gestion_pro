const acciones = [
  "Nuevo presupuesto",
  "Nuevo pedido",
  "Añadir cliente",
  "Registrar gasto",
];

export default function QuickActions() {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#E8ECEC] p-5 shadow-xl shadow-black/10">

      <div>
        <h2 className="text-base font-bold text-[#1C2526]">
          Acciones rápidas
        </h2>

        <p className="mt-1 text-xs text-slate-500">
          Tareas más habituales
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">

        {acciones.map((accion) => (
          <button
            key={accion}
            className="group flex min-h-[58px] items-center justify-between gap-2 rounded-xl border border-slate-300/70 bg-[#F5F7F7] px-3 py-2 text-left transition-all duration-200 hover:border-[#0F766E]/50 hover:bg-[#DDF5F1]"
          >
            <span className="text-xs font-semibold leading-tight text-slate-700">
              {accion}
            </span>

            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#BFEDE7] text-sm font-medium text-[#0F766E] transition group-hover:bg-[#0F766E] group-hover:text-white">
              +
            </span>
          </button>
        ))}

      </div>

    </section>
  );
}