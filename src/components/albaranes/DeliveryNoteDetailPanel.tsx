"use client";

import type {
  Albaran,
  EstadoAlbaran,
} from "./NewDeliveryNotePanel";

type Props = {
  albaran: Albaran | null;
  cerrar: () => void;

  cambiarEstado: (
    id: number,
    estado: EstadoAlbaran
  ) => void;
};

const estados: EstadoAlbaran[] = [
  "Pendiente",
  "Preparado",
  "Entregado",
];

export default function DeliveryNoteDetailPanel({
  albaran,
  cerrar,
  cambiarEstado,
}: Props) {
  if (!albaran) return null;

  return (
    <>
      {/* FONDO */}

      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
        onClick={cerrar}
      />

      {/* PANEL */}

      <aside className="fixed right-0 top-0 z-50 flex h-screen w-full max-w-2xl flex-col bg-[#E8ECEC] shadow-2xl">

        {/* CABECERA */}

        <div className="border-b border-slate-300 px-6 py-5">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0F766E]">
                Albarán
              </p>

              <h2 className="mt-1 text-xl font-bold text-[#1C2526]">
                {albaran.numero}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {albaran.cliente}
              </p>

            </div>

            <button
              type="button"
              onClick={cerrar}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-[#F5F7F7] text-lg text-slate-500"
            >
              ×
            </button>

          </div>

          <div className="mt-4 flex items-center gap-3">

            <Estado estado={albaran.estado} />

            <span className="text-xs text-slate-500">
              {albaran.fecha}
            </span>

          </div>

        </div>

        {/* CONTENIDO */}

        <div className="flex-1 overflow-y-auto p-6">

          {/* DATOS */}

          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
            Información general
          </p>

          <div className="grid grid-cols-2 gap-3">

            <Dato
              titulo="Cliente"
              valor={albaran.cliente}
            />

            <Dato
              titulo="Pedido origen"
              valor={albaran.pedido}
            />

            <Dato
              titulo="Fecha"
              valor={albaran.fecha}
            />

            <Dato
              titulo="Estado"
              valor={albaran.estado}
            />

          </div>

          {/* PRODUCTOS */}

          <div className="mt-7">

            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
              Productos
            </p>

            <div className="overflow-hidden rounded-xl border border-slate-300 bg-[#F5F7F7]">

              <table className="w-full">

                <thead>

                  <tr className="border-b border-slate-300 bg-[#DDE2E2] text-left">

                    <th className="px-4 py-3 text-[11px] font-semibold uppercase text-slate-500">
                      Producto
                    </th>

                    <th className="px-4 py-3 text-[11px] font-semibold uppercase text-slate-500">
                      Referencia
                    </th>

                    <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase text-slate-500">
                      Cantidad
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {albaran.lineas.map(
                    (linea) => (

                      <tr
                        key={linea.id}
                        className="border-b border-slate-200 last:border-0"
                      >

                        <td className="px-4 py-3 text-sm font-semibold text-[#1C2526]">
                          {linea.producto}
                        </td>

                        <td className="px-4 py-3 text-sm text-slate-500">
                          {linea.referencia}
                        </td>

                        <td className="px-4 py-3 text-right text-sm font-semibold text-slate-700">
                          {linea.cantidad}
                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          </div>

          {/* OBSERVACIONES */}

          <div className="mt-7">

            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
              Observaciones
            </p>

            <div className="rounded-xl border border-slate-300 bg-[#F5F7F7] p-4">

              <p className="text-sm leading-6 text-slate-600">
                {albaran.observaciones ||
                  "Sin observaciones."}
              </p>

            </div>

          </div>

          {/* ESTADO */}

          <div className="mt-7">

            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
              Estado del albarán
            </p>

            <div className="rounded-xl border border-slate-300 bg-[#F5F7F7] p-4">

              <div className="flex flex-wrap gap-2">

                {estados.map((estado) => (

                  <button
                    key={estado}
                    type="button"
                    onClick={() =>
                      cambiarEstado(
                        albaran.id,
                        estado
                      )
                    }
                    className={`rounded-lg border px-4 py-2 text-xs font-semibold transition ${
                      albaran.estado === estado
                        ? "border-[#0F766E] bg-[#0F766E] text-white"
                        : "border-slate-300 bg-white text-slate-600 hover:border-[#0F766E]"
                    }`}
                  >
                    {estado}
                  </button>

                ))}

              </div>

            </div>

          </div>

          {/* ENTREGADO */}

          {albaran.estado === "Entregado" && (

            <div className="mt-5 rounded-xl border border-[#0F766E]/20 bg-[#BFEDE7]/50 p-4">

              <p className="text-sm font-bold text-[#0F766E]">
                Mercancía entregada
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-600">
                El albarán consta como entregado al cliente.
              </p>

            </div>

          )}

        </div>

        {/* PIE */}

        <div className="flex justify-end border-t border-slate-300 bg-[#DDE2E2] px-6 py-4">

          <button
            type="button"
            onClick={cerrar}
            className="rounded-xl bg-[#0F766E] px-5 py-2.5 text-sm font-semibold text-white"
          >
            Cerrar
          </button>

        </div>

      </aside>
    </>
  );
}

function Dato({
  titulo,
  valor,
}: {
  titulo: string;
  valor: string;
}) {
  return (
    <div className="rounded-xl border border-slate-300 bg-[#F5F7F7] p-4">

      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        {titulo}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-700">
        {valor}
      </p>

    </div>
  );
}

function Estado({
  estado,
}: {
  estado: EstadoAlbaran;
}) {
  const estilos: Record<
    EstadoAlbaran,
    string
  > = {
    Pendiente:
      "bg-amber-100 text-amber-700",

    Preparado:
      "bg-blue-100 text-blue-700",

    Entregado:
      "bg-emerald-100 text-emerald-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${estilos[estado]}`}
    >
      {estado}
    </span>
  );
}