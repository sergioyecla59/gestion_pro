"use client";

import type {
  EstadoFactura,
  Factura,
} from "./NewInvoicePanel";

type Props = {
  factura: Factura | null;
  cerrar: () => void;

  cambiarEstado: (
    id: number,
    estado: EstadoFactura
  ) => void;
};

const estados: EstadoFactura[] = [
  "Pendiente",
  "Pagada",
  "Vencida",
  "Anulada",
];

export default function InvoiceDetailPanel({
  factura,
  cerrar,
  cambiarEstado,
}: Props) {
  if (!factura) return null;

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
                Factura
              </p>

              <h2 className="mt-1 text-xl font-bold text-[#1C2526]">
                {factura.numero}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {factura.cliente}
              </p>
            </div>

            <button
              type="button"
              onClick={cerrar}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-[#F5F7F7] text-lg text-slate-500 transition hover:bg-white"
            >
              ×
            </button>

          </div>

          <div className="mt-4 flex items-center gap-3">

            <Estado estado={factura.estado} />

            <span className="text-xs text-slate-500">
              Fecha: {factura.fecha}
            </span>

          </div>

        </div>

        {/* CONTENIDO */}

        <div className="flex-1 overflow-y-auto p-6">

          {/* INFORMACIÓN GENERAL */}

          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
            Información general
          </p>

          <div className="grid grid-cols-2 gap-3">

            <Dato
              titulo="Cliente"
              valor={factura.cliente}
            />

            <Dato
              titulo="Origen"
              valor={factura.origen}
            />

            <Dato
              titulo="Fecha"
              valor={factura.fecha}
            />

            <Dato
              titulo="Vencimiento"
              valor={factura.vencimiento}
            />

          </div>

          {/* PRODUCTOS */}

          <div className="mt-7">

            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
              Conceptos facturados
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

                  {factura.lineas.map((linea) => (

                    <tr
                      key={linea.id}
                      className="border-b border-slate-200 last:border-0"
                    >

                      <td className="px-4 py-3">

                        <p className="text-sm font-semibold text-[#1C2526]">
                          {linea.concepto}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-400">
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
              titulo="Base imponible"
              valor={factura.subtotal}
            />

            <FilaTotal
              titulo="IVA (21%)"
              valor={factura.iva}
            />

            <div className="my-3 border-t border-slate-300" />

            <div className="flex items-center justify-between">

              <span className="text-sm font-bold text-[#1C2526]">
                Total
              </span>

              <span className="text-lg font-bold text-[#0F766E]">
                {formatearDinero(
                  factura.total
                )}
              </span>

            </div>

          </div>

          {/* ESTADO */}

          <div className="mt-7">

            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
              Estado de la factura
            </p>

            <div className="rounded-xl border border-slate-300 bg-[#F5F7F7] p-4">

              <p className="mb-3 text-sm text-slate-600">
                Actualiza el estado de cobro de esta factura.
              </p>

              <div className="flex flex-wrap gap-2">

                {estados.map((estado) => (

                  <button
                    key={estado}
                    type="button"
                    onClick={() =>
                      cambiarEstado(
                        factura.id,
                        estado
                      )
                    }
                    className={`rounded-lg border px-4 py-2 text-xs font-semibold transition ${
                      factura.estado === estado
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

          {/* FACTURA PAGADA */}

          {factura.estado === "Pagada" && (

            <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4">

              <p className="text-sm font-bold text-emerald-700">
                Factura cobrada
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-600">
                Esta factura consta como pagada por el cliente.
              </p>

            </div>

          )}

          {/* FACTURA VENCIDA */}

          {factura.estado === "Vencida" && (

            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">

              <p className="text-sm font-bold text-red-700">
                Factura vencida
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-600">
                El plazo de pago de esta factura ha vencido y sigue pendiente de cobro.
              </p>

            </div>

          )}

          {/* PDF FUTURO */}

          <div className="mt-7">

            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
              Documento
            </p>

            <div className="flex items-center justify-between rounded-xl border border-slate-300 bg-[#F5F7F7] p-4">

              <div>
                <p className="text-sm font-semibold text-[#1C2526]">
                  Factura en PDF
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  La generación e impresión del documento se conectará más adelante.
                </p>
              </div>

              <button
                type="button"
                disabled
                className="cursor-not-allowed rounded-lg border border-slate-300 bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-400"
              >
                PDF
              </button>

            </div>

          </div>

        </div>

        {/* PIE */}

        <div className="flex justify-end border-t border-slate-300 bg-[#DDE2E2] px-6 py-4">

          <button
            type="button"
            onClick={cerrar}
            className="rounded-xl bg-[#0F766E] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#115E59]"
          >
            Cerrar
          </button>

        </div>

      </aside>
    </>
  );
}

/* ==========================================================
   COMPONENTES AUXILIARES
========================================================== */

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
  estado: EstadoFactura;
}) {
  const estilos: Record<
    EstadoFactura,
    string
  > = {
    Pendiente:
      "bg-amber-100 text-amber-700",

    Pagada:
      "bg-emerald-100 text-emerald-700",

    Vencida:
      "bg-red-100 text-red-700",

    Anulada:
      "bg-slate-200 text-slate-600",
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