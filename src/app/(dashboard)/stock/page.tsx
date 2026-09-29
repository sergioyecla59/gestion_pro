"use client";

import { useState } from "react";

import StockMovementPanel, {
  MovimientoStock,
  NuevoMovimiento,
} from "@/components/stock/StockMovementPanel";

const movimientosIniciales: MovimientoStock[] = [
  {
    id: 1,
    producto: "Colchón Premium Visco",
    referencia: "COL-001",
    tipo: "Entrada",
    cantidad: 20,
    motivo: "Entrada de proveedor",
    fecha: "24/09/2026",
  },
  {
    id: 2,
    producto: "Almohada Viscoelástica",
    referencia: "ALM-001",
    tipo: "Salida",
    cantidad: 3,
    motivo: "Venta",
    fecha: "23/09/2026",
  },
  {
    id: 3,
    producto: "Canapé Abatible",
    referencia: "CAN-001",
    tipo: "Salida",
    cantidad: 2,
    motivo: "Pedido cliente",
    fecha: "23/09/2026",
  },
];

export default function StockPage() {
  const [movimientos, setMovimientos] =
    useState<MovimientoStock[]>(
      movimientosIniciales
    );

  const [busqueda, setBusqueda] =
    useState("");

  const [filtroTipo, setFiltroTipo] =
    useState("Todos");

  const [panelAbierto, setPanelAbierto] =
    useState(false);

  /* ==========================================================
     FILTRAR MOVIMIENTOS
  ========================================================== */

  const movimientosFiltrados =
    movimientos.filter((movimiento) => {
      const texto = busqueda.toLowerCase();

      const coincideBusqueda =
        movimiento.producto
          .toLowerCase()
          .includes(texto) ||
        movimiento.referencia
          .toLowerCase()
          .includes(texto) ||
        movimiento.motivo
          .toLowerCase()
          .includes(texto);

      const coincideTipo =
        filtroTipo === "Todos" ||
        movimiento.tipo === filtroTipo;

      return coincideBusqueda && coincideTipo;
    });

  /* ==========================================================
     GUARDAR MOVIMIENTO
  ========================================================== */

  function guardarMovimiento(
    nuevoMovimiento: NuevoMovimiento
  ) {
    const movimiento: MovimientoStock = {
      id: Date.now(),
      ...nuevoMovimiento,
      fecha: new Date().toLocaleDateString(
        "es-ES"
      ),
    };

    setMovimientos((actuales) => [
      movimiento,
      ...actuales,
    ]);
  }

  /* ==========================================================
     RESUMEN
  ========================================================== */

  const totalEntradas = movimientos
    .filter(
      (movimiento) =>
        movimiento.tipo === "Entrada"
    )
    .reduce(
      (total, movimiento) =>
        total + movimiento.cantidad,
      0
    );

  const totalSalidas = movimientos
    .filter(
      (movimiento) =>
        movimiento.tipo === "Salida"
    )
    .reduce(
      (total, movimiento) =>
        total + movimiento.cantidad,
      0
    );

  return (
    <>
      {/* CABECERA */}

      <section className="flex items-end justify-between">

        <div>

          <p className="mb-1 text-xs font-bold uppercase tracking-[0.14em] text-[#5EEAD4]">
            Inventario
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-white">
            Stock
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Controla las entradas, salidas y movimientos de inventario.
          </p>

        </div>

        <button
          onClick={() =>
            setPanelAbierto(true)
          }
          className="rounded-xl bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#115E59]"
        >
          + Nuevo movimiento
        </button>

      </section>

      {/* RESUMEN */}

      <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">

        <TarjetaResumen
          titulo="Entradas registradas"
          valor={`${totalEntradas} uds.`}
          descripcion="Unidades añadidas"
        />

        <TarjetaResumen
          titulo="Salidas registradas"
          valor={`${totalSalidas} uds.`}
          descripcion="Unidades retiradas"
        />

        <TarjetaResumen
          titulo="Movimientos"
          valor={movimientos.length.toString()}
          descripcion="Movimientos registrados"
        />

      </section>

      {/* HISTORIAL */}

      <section className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-[#E8ECEC] shadow-xl shadow-black/10">

        {/* BUSCADOR */}

        <div className="flex items-center justify-between gap-4 border-b border-slate-300 p-5">

          <div className="relative w-full max-w-sm">

            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              ⌕
            </span>

            <input
              value={busqueda}
              onChange={(event) =>
                setBusqueda(event.target.value)
              }
              placeholder="Buscar producto, referencia..."
              className="h-10 w-full rounded-xl border border-slate-300 bg-[#F5F7F7] pl-11 pr-4 text-sm text-slate-800 outline-none focus:border-[#0F766E]"
            />

          </div>

          <select
            value={filtroTipo}
            onChange={(event) =>
              setFiltroTipo(event.target.value)
            }
            className="rounded-xl border border-slate-300 bg-[#F5F7F7] px-4 py-2.5 text-sm font-medium text-slate-600 outline-none focus:border-[#0F766E]"
          >
            <option value="Todos">
              Todos los movimientos
            </option>

            <option value="Entrada">
              Entradas
            </option>

            <option value="Salida">
              Salidas
            </option>
          </select>

        </div>

        {/* TABLA */}

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b border-slate-300 bg-[#DDE2E2] text-left">

                {[
                  "Fecha",
                  "Producto",
                  "Referencia",
                  "Tipo",
                  "Cantidad",
                  "Motivo",
                ].map((titulo) => (
                  <th
                    key={titulo}
                    className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500"
                  >
                    {titulo}
                  </th>
                ))}

              </tr>

            </thead>

            <tbody>

              {movimientosFiltrados.map(
                (movimiento) => (

                  <tr
                    key={movimiento.id}
                    className="border-b border-slate-300/70 last:border-0 hover:bg-[#F5F7F7]"
                  >

                    <td className="px-5 py-4 text-sm text-slate-500">
                      {movimiento.fecha}
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-[#1C2526]">
                      {movimiento.producto}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {movimiento.referencia}
                    </td>

                    <td className="px-5 py-4">

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          movimiento.tipo ===
                          "Entrada"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {movimiento.tipo}
                      </span>

                    </td>

                    <td className="px-5 py-4 text-sm font-bold text-slate-700">
                      {movimiento.tipo ===
                      "Entrada"
                        ? "+"
                        : "-"}
                      {movimiento.cantidad}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {movimiento.motivo || "—"}
                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

        {/* PIE */}

        <div className="border-t border-slate-300 px-5 py-4">

          <p className="text-xs text-slate-500">
            Mostrando{" "}
            {movimientosFiltrados.length} de{" "}
            {movimientos.length} movimientos
          </p>

        </div>

      </section>

      {/* NUEVO MOVIMIENTO */}

      {panelAbierto && (
        <StockMovementPanel
          cerrar={() =>
            setPanelAbierto(false)
          }
          guardar={guardarMovimiento}
        />
      )}

    </>
  );
}

/* ==========================================================
   TARJETA RESUMEN
========================================================== */

function TarjetaResumen({
  titulo,
  valor,
  descripcion,
}: {
  titulo: string;
  valor: string;
  descripcion: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#E8ECEC] p-5">

      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        {titulo}
      </p>

      <p className="mt-2 text-2xl font-bold text-[#1C2526]">
        {valor}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {descripcion}
      </p>

    </div>
  );
}