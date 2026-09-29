"use client";

import type {
  EstadoPedido,
  Pedido,
} from "./NewOrderPanel";

type Props = {
  pedido: Pedido | null;
  cerrar: () => void;
  cambiarEstado: (
    id: number,
    estado: EstadoPedido
  ) => void;
};

const estados: EstadoPedido[] = [
  "Pendiente",
  "Preparando",
  "Enviado",
  "Completado",
  "Cancelado",
];

export default function OrderDetailPanel({
  pedido,
  cerrar,
  cambiarEstado,
}: Props) {
  if (!pedido) return null;

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
                Pedido
              </p>

              <h2 className="mt-1 text-xl font-bold text-[#1C2526]">
                {pedido.numero}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {pedido.cliente}
              </p>

            </div>

            <button
              onClick={cerrar}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-[#F5F7F7] text-lg text-slate-500"
            >
              ×
            </button>

          </div>

          <div className="mt-4 flex items-center gap-3">

            <Estado estado={pedido.estado} />

            <span className="text-xs text-slate-500">
              {pedido.fecha}
            </span>

          </div>

        </div>

        {/* CONTENIDO */}

        <div className="flex-1 overflow-y-auto p-6">

          {/* INFORMACIÓN */}

          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
            Información general
          </p>

          <div className="grid grid-cols-2 gap-3">

            <Dato
              titulo="Cliente"
              valor={pedido.cliente}
            />

            <Dato
              titulo="Fecha"
              valor={pedido.fecha}
            />

            <Dato
              titulo="Origen"
              valor={pedido.origen}
            />

            <Dato
              titulo="Estado"
              valor={pedido.estado}
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
                      Cant.
                    </th>

                    <th className="px-4 py-3 text-[11px] font-semibold uppercase text-slate-500">
                      Precio
                    </th>

                    <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase text-slate-500">
                      Importe
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {pedido.lineas.map((linea) => (

                    <tr
                      key={linea.id}
                      className="border-b border-slate-200 last:border-0"
                    >

                      <td className="px-4 py-3">

                        <p className="text-sm font-semibold text-[#1C2526]">
                          {linea.producto}
                        </p>

                        <p className="text-xs text-slate-400">
                          {linea.referencia}
                        </p>

                      </td>

                      <td className="px-4 py-3 text-sm text-slate-600">
                        {linea.cantidad}
                      </td>

                      <td className="px-4 py-3 text-sm text-slate-600">
                        {formatearDinero(
                          linea.precio
                        )}
                      </td>

                      <td className="px-4 py-3 text-right text-sm font-semibold text-slate-700">
                        {formatearDinero(
                          linea.precio *
                            linea.cantidad
                        )}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

          {/* TOTALES */}

          <div className="mt-5 ml-auto w-full max-w-xs rounded-xl border border-slate-300 bg-[#F5F7F7] p-4">

            <FilaTotal
              titulo="Subtotal"
              valor={pedido.subtotal}
            />

            <FilaTotal
              titulo="IVA (21%)"
              valor={pedido.iva}
            />

            <div className="my-3 border-t border-slate-300" />

            <div className="flex justify-between">

              <span className="text-sm font-bold text-[#1C2526]">
                Total
              </span>

              <span className="text-lg font-bold text-[#0F766E]">
                {formatearDinero(
                  pedido.total
                )}
              </span>

            </div>

          </div>

          {/* ESTADO */}

          <div className="mt-7">

            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
              Estado del pedido
            </p>

            <div className="rounded-xl border border-slate-300 bg-[#F5F7F7] p-4">

              <div className="flex flex-wrap gap-2">

                {estados.map((estado) => (

                  <button
                    key={estado}
                    type="button"
                    onClick={() =>
                      cambiarEstado(
                        pedido.id,
                        estado
                      )
                    }
                    className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                      pedido.estado === estado
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

          {/* SIGUIENTE PASO */}

          {pedido.estado === "Enviado" && (

            <div className="mt-5 rounded-xl border border-[#0F766E]/20 bg-[#BFEDE7]/50 p-4">

              <p className="text-sm font-bold text-[#0F766E]">
                Pedido enviado
              </p>

              <p className="mt-1 text-xs text-slate-600">
                Este pedido podrá relacionarse con su albarán de entrega.
              </p>

            </div>

          )}

        </div>

        {/* PIE */}

        <div className="flex justify-end border-t border-slate-300 bg-[#DDE2E2] px-6 py-4">

          <button
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

function FilaTotal({
  titulo,
  valor,
}: {
  titulo: string;
  valor: number;
}) {
  return (
    <div className="mb-2 flex justify-between text-sm">

      <span className="text-slate-500">
        {titulo}
      </span>

      <span className="font-semibold text-slate-700">
        {formatearDinero(valor)}
      </span>

    </div>
  );
}

function Estado({
  estado,
}: {
  estado: EstadoPedido;
}) {
  const estilos: Record<
    EstadoPedido,
    string
  > = {
    Pendiente:
      "bg-amber-100 text-amber-700",

    Preparando:
      "bg-blue-100 text-blue-700",

    Enviado:
      "bg-violet-100 text-violet-700",

    Completado:
      "bg-emerald-100 text-emerald-700",

    Cancelado:
      "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${estilos[estado]}`}
    >
      {estado}
    </span>
  );
}

function formatearDinero(
  cantidad: number
) {
  return `${cantidad.toLocaleString(
    "es-ES",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  )} €`;
}