"use client";

import { useState } from "react";

import NewExpensePanel, {
  EstadoGasto,
  Gasto,
  NuevoGasto,
} from "@/components/gastos/NewExpensePanel";

const gastosIniciales: Gasto[] = [
  {
    id: 1,
    concepto: "Compra de espuma HR",
    proveedor: "Espumas Levante S.L.",
    categoria: "Compras",
    fecha: "24/09/2026",
    importe: 1250,
    estado: "Pagado",
    referencia: "EL-2026-845",
    observaciones: "",
  },
  {
    id: 2,
    concepto: "Tejido para producción",
    proveedor: "Textiles del Sureste",
    categoria: "Compras",
    fecha: "22/09/2026",
    importe: 780.5,
    estado: "Pendiente",
    referencia: "TS-4587",
    observaciones: "",
  },
  {
    id: 3,
    concepto: "Transporte mercancía",
    proveedor: "Otro",
    categoria: "Transporte",
    fecha: "20/09/2026",
    importe: 185,
    estado: "Pagado",
    referencia: "TR-0926",
    observaciones: "",
  },
  {
    id: 4,
    concepto: "Suministro eléctrico",
    proveedor: "Otro",
    categoria: "Suministros",
    fecha: "15/09/2026",
    importe: 342.8,
    estado: "Pagado",
    referencia: "SUM-09",
    observaciones: "",
  },
];

export default function GastosPage() {
  const [gastos, setGastos] =
    useState<Gasto[]>(
      gastosIniciales
    );

  const [busqueda, setBusqueda] =
    useState("");

  const [filtroEstado, setFiltroEstado] =
    useState("Todos");

  const [panelAbierto, setPanelAbierto] =
    useState(false);

  /* ==========================================================
     FILTROS
  ========================================================== */

  const gastosFiltrados =
    gastos.filter((gasto) => {
      const texto =
        busqueda.toLowerCase();

      const coincideBusqueda =
        gasto.concepto
          .toLowerCase()
          .includes(texto) ||
        gasto.proveedor
          .toLowerCase()
          .includes(texto) ||
        gasto.referencia
          .toLowerCase()
          .includes(texto);

      const coincideEstado =
        filtroEstado === "Todos" ||
        gasto.estado === filtroEstado;

      return (
        coincideBusqueda &&
        coincideEstado
      );
    });

  /* ==========================================================
     CREAR
  ========================================================== */

  function guardarGasto(
    nuevoGasto: NuevoGasto
  ) {
    const gasto: Gasto = {
      id: Date.now(),

      fecha:
        new Date().toLocaleDateString(
          "es-ES"
        ),

      ...nuevoGasto,
    };

    setGastos((actuales) => [
      gasto,
      ...actuales,
    ]);
  }

  /* ==========================================================
     CAMBIAR ESTADO
  ========================================================== */

  function cambiarEstado(
    id: number
  ) {
    setGastos((actuales) =>
      actuales.map((gasto) =>
        gasto.id === id
          ? {
              ...gasto,

              estado:
                gasto.estado === "Pagado"
                  ? "Pendiente"
                  : "Pagado",
            }
          : gasto
      )
    );
  }

  /* ==========================================================
     ELIMINAR
  ========================================================== */

  function eliminarGasto(id: number) {
    const confirmado =
      window.confirm(
        "¿Seguro que quieres eliminar este gasto?"
      );

    if (!confirmado) return;

    setGastos((actuales) =>
      actuales.filter(
        (gasto) =>
          gasto.id !== id
      )
    );
  }

  /* ==========================================================
     TOTALES
  ========================================================== */

  const totalGastos = gastos.reduce(
    (total, gasto) =>
      total + gasto.importe,
    0
  );

  const totalPagado = gastos
    .filter(
      (gasto) =>
        gasto.estado === "Pagado"
    )
    .reduce(
      (total, gasto) =>
        total + gasto.importe,
      0
    );

  const totalPendiente = gastos
    .filter(
      (gasto) =>
        gasto.estado === "Pendiente"
    )
    .reduce(
      (total, gasto) =>
        total + gasto.importe,
      0
    );

  return (
    <>
      {/* CABECERA */}

      <section className="flex items-end justify-between">

        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.14em] text-[#5EEAD4]">
            Gestión
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-white">
            Gastos
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Controla los gastos y pagos de tu empresa.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setPanelAbierto(true)
          }
          className="rounded-xl bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#115E59]"
        >
          + Nuevo gasto
        </button>

      </section>

      {/* RESUMEN */}

      <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">

        <Tarjeta
          titulo="Gastos totales"
          valor={totalGastos}
        />

        <Tarjeta
          titulo="Pagado"
          valor={totalPagado}
        />

        <Tarjeta
          titulo="Pendiente de pago"
          valor={totalPendiente}
        />

      </section>

      {/* TABLA */}

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
                setBusqueda(
                  event.target.value
                )
              }
              placeholder="Buscar gasto, proveedor..."
              className="h-10 w-full rounded-xl border border-slate-300 bg-[#F5F7F7] pl-11 pr-4 text-sm text-slate-800 outline-none focus:border-[#0F766E]"
            />

          </div>

          <select
            value={filtroEstado}
            onChange={(event) =>
              setFiltroEstado(
                event.target.value
              )
            }
            className="rounded-xl border border-slate-300 bg-[#F5F7F7] px-4 py-2.5 text-sm font-medium text-slate-600 outline-none focus:border-[#0F766E]"
          >
            <option value="Todos">
              Todos los estados
            </option>

            <option value="Pagado">
              Pagados
            </option>

            <option value="Pendiente">
              Pendientes
            </option>
          </select>

        </div>

        {/* TABLA */}

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b border-slate-300 bg-[#DDE2E2] text-left">

                {[
                  "Concepto",
                  "Proveedor",
                  "Categoría",
                  "Fecha",
                  "Importe",
                  "Estado",
                  "Acciones",
                ].map((titulo) => (
                  <th
                    key={titulo}
                    className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 last:text-right"
                  >
                    {titulo}
                  </th>
                ))}

              </tr>

            </thead>

            <tbody>

              {gastosFiltrados.map(
                (gasto) => (

                  <tr
                    key={gasto.id}
                    className="border-b border-slate-300/70 transition last:border-0 hover:bg-[#F5F7F7]"
                  >

                    <td className="px-5 py-4">

                      <p className="text-sm font-semibold text-[#1C2526]">
                        {gasto.concepto}
                      </p>

                      {gasto.referencia && (
                        <p className="mt-1 text-xs text-slate-400">
                          {gasto.referencia}
                        </p>
                      )}

                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {gasto.proveedor}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {gasto.categoria}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {gasto.fecha}
                    </td>

                    <td className="px-5 py-4 text-sm font-bold text-slate-700">
                      {formatearDinero(
                        gasto.importe
                      )}
                    </td>

                    <td className="px-5 py-4">

                      <Estado
                        estado={
                          gasto.estado
                        }
                      />

                    </td>

                    <td className="px-5 py-4 text-right">

                      <button
                        type="button"
                        onClick={() =>
                          cambiarEstado(
                            gasto.id
                          )
                        }
                        className="rounded-lg px-3 py-1.5 text-sm font-semibold text-[#0F766E] transition hover:bg-[#BFEDE7]"
                      >
                        {gasto.estado ===
                        "Pagado"
                          ? "Pendiente"
                          : "Marcar pagado"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          eliminarGasto(
                            gasto.id
                          )
                        }
                        className="rounded-lg px-3 py-1.5 text-sm font-semibold text-red-500 transition hover:bg-red-50"
                      >
                        Eliminar
                      </button>

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
            {gastosFiltrados.length} de{" "}
            {gastos.length} gastos
          </p>

        </div>

      </section>

      {/* NUEVO GASTO */}

      {panelAbierto && (

        <NewExpensePanel
          cerrar={() =>
            setPanelAbierto(false)
          }
          guardar={guardarGasto}
        />

      )}

    </>
  );
}

/* ==========================================================
   COMPONENTES AUXILIARES
========================================================== */

function Tarjeta({
  titulo,
  valor,
}: {
  titulo: string;
  valor: number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#E8ECEC] p-5">

      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        {titulo}
      </p>

      <p className="mt-2 text-2xl font-bold text-[#1C2526]">
        {formatearDinero(valor)}
      </p>

    </div>
  );
}

function Estado({
  estado,
}: {
  estado: EstadoGasto;
}) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
        estado === "Pagado"
          ? "bg-emerald-100 text-emerald-700"
          : "bg-amber-100 text-amber-700"
      }`}
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