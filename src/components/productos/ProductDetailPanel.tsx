"use client";

import type { Producto } from "./NewProductPanel";

type Props = {
  producto: Producto | null;
  cerrar: () => void;
  editar: (producto: Producto) => void;
};

export default function ProductDetailPanel({
  producto,
  cerrar,
  editar,
}: Props) {
  if (!producto) return null;

  const stockBajo =
    producto.stock <= producto.stockMinimo;

  return (
    <>
      {/* FONDO */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
        onClick={cerrar}
      />

      {/* PANEL */}
      <aside className="fixed right-0 top-0 z-50 flex h-screen w-full max-w-md flex-col bg-[#E8ECEC] shadow-2xl">

        {/* CABECERA */}
        <div className="border-b border-slate-300 px-6 py-5">

          <div className="flex items-start justify-between">

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#BFEDE7] text-lg font-bold text-[#0F766E]">
                {producto.nombre.charAt(0)}
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0F766E]">
                  Producto
                </p>

                <h2 className="mt-1 text-xl font-bold text-[#1C2526]">
                  {producto.nombre}
                </h2>
              </div>

            </div>

            <button
              onClick={cerrar}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-[#F5F7F7] text-lg text-slate-500 transition hover:bg-white"
            >
              ×
            </button>

          </div>

          <div className="mt-4 flex gap-2">

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                producto.estado === "Activo"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-300 text-slate-600"
              }`}
            >
              {producto.estado}
            </span>

            {stockBajo && (
              <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                Stock bajo
              </span>
            )}

          </div>

        </div>

        {/* INFORMACIÓN */}
        <div className="flex-1 overflow-y-auto p-6">

          <p className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">
            Información del producto
          </p>

          <div className="space-y-3">

            <Dato
              titulo="Referencia / SKU"
              valor={producto.referencia}
            />

            <Dato
              titulo="Categoría"
              valor={producto.categoria || "Sin categoría"}
            />

            <Dato
              titulo="Precio de venta"
              valor={`${producto.precio.toLocaleString(
                "es-ES",
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              )} €`}
            />

            <div className="grid grid-cols-2 gap-3">

              <Dato
                titulo="Stock actual"
                valor={`${producto.stock} uds.`}
              />

              <Dato
                titulo="Stock mínimo"
                valor={`${producto.stockMinimo} uds.`}
              />

            </div>

          </div>

          {/* CONTROL DE STOCK */}
          <div className="mt-7">

            <p className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">
              Control de stock
            </p>

            <div
              className={`rounded-xl border p-5 ${
                stockBajo
                  ? "border-red-200 bg-red-50"
                  : "border-emerald-200 bg-emerald-50"
              }`}
            >

              <p
                className={`text-sm font-bold ${
                  stockBajo
                    ? "text-red-700"
                    : "text-emerald-700"
                }`}
              >
                {stockBajo
                  ? "Stock por debajo del mínimo"
                  : "Stock disponible"}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Stock actual: {producto.stock} unidades ·
                Mínimo recomendado: {producto.stockMinimo}
              </p>

            </div>

          </div>

        </div>

        {/* BOTONES */}
        <div className="flex justify-end gap-3 border-t border-slate-300 bg-[#DDE2E2] px-6 py-4">

          <button
            onClick={cerrar}
            className="rounded-xl border border-slate-300 bg-[#F5F7F7] px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-white"
          >
            Cerrar
          </button>

          <button
            onClick={() => editar(producto)}
            className="rounded-xl bg-[#0F766E] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#115E59]"
          >
            Editar producto
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