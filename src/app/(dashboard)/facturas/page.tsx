"use client";

import { useState } from "react";

import NewInvoicePanel, {
  EstadoFactura,
  Factura,
  NuevaFactura,
} from "@/components/facturas/NewInvoicePanel";

import InvoiceDetailPanel from "@/components/facturas/InvoiceDetailPanel";

const facturasIniciales: Factura[] = [
  {
    id: 1,
    numero: "FAC-2026-001",
    cliente: "Muebles García",
    fecha: "24/09/2026",
    vencimiento: "30 días",
    estado: "Pendiente",
    origen: "PED-2026-001",
    lineas: [
      {
        id: 1,
        concepto: "Colchón Premium Visco",
        referencia: "COL-001",
        cantidad: 2,
        precio: 499,
      },
    ],
    subtotal: 998,
    iva: 209.58,
    total: 1207.58,
  },
  {
    id: 2,
    numero: "FAC-2026-002",
    cliente: "Sofás Martínez",
    fecha: "22/09/2026",
    vencimiento: "30 días",
    estado: "Pagada",
    origen: "PED-2026-002",
    lineas: [
      {
        id: 2,
        concepto: "Canapé Abatible",
        referencia: "CAN-001",
        cantidad: 2,
        precio: 349,
      },
    ],
    subtotal: 698,
    iva: 146.58,
    total: 844.58,
  },
  {
    id: 3,
    numero: "FAC-2026-003",
    cliente: "Descanso Levante",
    fecha: "10/08/2026",
    vencimiento: "30 días",
    estado: "Vencida",
    origen: "PED-2026-003",
    lineas: [
      {
        id: 3,
        concepto: "Almohada Viscoelástica",
        referencia: "ALM-001",
        cantidad: 10,
        precio: 59.9,
      },
    ],
    subtotal: 599,
    iva: 125.79,
    total: 724.79,
  },
];

export default function FacturasPage() {
  const [facturas, setFacturas] =
    useState<Factura[]>(
      facturasIniciales
    );

  const [busqueda, setBusqueda] =
    useState("");

  const [filtroEstado, setFiltroEstado] =
    useState("Todos");

  const [panelAbierto, setPanelAbierto] =
    useState(false);

  const [
    facturaSeleccionada,
    setFacturaSeleccionada,
  ] = useState<Factura | null>(null);

  /* ==========================================================
     FILTRAR
  ========================================================== */

  const facturasFiltradas =
    facturas.filter((factura) => {
      const texto =
        busqueda.toLowerCase();

      const coincideBusqueda =
        factura.numero
          .toLowerCase()
          .includes(texto) ||
        factura.cliente
          .toLowerCase()
          .includes(texto) ||
        factura.origen
          .toLowerCase()
          .includes(texto);

      const coincideEstado =
        filtroEstado === "Todos" ||
        factura.estado === filtroEstado;

      return (
        coincideBusqueda &&
        coincideEstado
      );
    });

  /* ==========================================================
     CREAR FACTURA
  ========================================================== */

  function guardarFactura(
    nuevaFactura: NuevaFactura
  ) {
    const subtotal =
      nuevaFactura.lineas.reduce(
        (total, linea) =>
          total +
          linea.precio *
            linea.cantidad,
        0
      );

    const iva = subtotal * 0.21;

    const total =
      subtotal + iva;

    const siguienteNumero =
      facturas.length + 1;

    const factura: Factura = {
      id: Date.now(),

      numero: `FAC-2026-${String(
        siguienteNumero
      ).padStart(3, "0")}`,

      fecha:
        new Date().toLocaleDateString(
          "es-ES"
        ),

      ...nuevaFactura,

      subtotal,
      iva,
      total,
    };

    setFacturas((actuales) => [
      factura,
      ...actuales,
    ]);
  }

  /* ==========================================================
     CAMBIAR ESTADO
  ========================================================== */

  function cambiarEstado(
    id: number,
    estado: EstadoFactura
  ) {
    setFacturas((actuales) =>
      actuales.map((factura) =>
        factura.id === id
          ? {
              ...factura,
              estado,
            }
          : factura
      )
    );

    setFacturaSeleccionada(
      (actual) =>
        actual &&
        actual.id === id
          ? {
              ...actual,
              estado,
            }
          : actual
    );
  }

  /* ==========================================================
     ELIMINAR
  ========================================================== */

  function eliminarFactura(id: number) {
    const confirmado =
      window.confirm(
        "¿Seguro que quieres eliminar esta factura?"
      );

    if (!confirmado) return;

    setFacturas((actuales) =>
      actuales.filter(
        (factura) =>
          factura.id !== id
      )
    );

    if (
      facturaSeleccionada?.id === id
    ) {
      setFacturaSeleccionada(null);
    }
  }

  /* ==========================================================
     RESUMEN
  ========================================================== */

  const totalFacturado =
    facturas
      .filter(
        (factura) =>
          factura.estado !== "Anulada"
      )
      .reduce(
        (total, factura) =>
          total + factura.total,
        0
      );

  const totalCobrado =
    facturas
      .filter(
        (factura) =>
          factura.estado === "Pagada"
      )
      .reduce(
        (total, factura) =>
          total + factura.total,
        0
      );

  const pendienteCobro =
    facturas
      .filter(
        (factura) =>
          factura.estado ===
            "Pendiente" ||
          factura.estado ===
            "Vencida"
      )
      .reduce(
        (total, factura) =>
          total + factura.total,
        0
      );

  return (
    <>
      {/* CABECERA */}

      <section className="flex items-end justify-between">

        <div>

          <p className="mb-1 text-xs font-bold uppercase tracking-[0.14em] text-[#5EEAD4]">
            Facturación
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-white">
            Facturas
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Gestiona la facturación y el estado de cobro de tus clientes.
          </p>

        </div>

        <button
          type="button"
          onClick={() =>
            setPanelAbierto(true)
          }
          className="rounded-xl bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#115E59]"
        >
          + Nueva factura
        </button>

      </section>

      {/* RESUMEN */}

      <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">

        <TarjetaResumen
          titulo="Facturado"
          valor={totalFacturado}
        />

        <TarjetaResumen
          titulo="Cobrado"
          valor={totalCobrado}
        />

        <TarjetaResumen
          titulo="Pendiente de cobro"
          valor={pendienteCobro}
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
              placeholder="Buscar factura, cliente..."
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

            <option value="Pendiente">
              Pendientes
            </option>

            <option value="Pagada">
              Pagadas
            </option>

            <option value="Vencida">
              Vencidas
            </option>

            <option value="Anulada">
              Anuladas
            </option>

          </select>

        </div>

        {/* TABLA */}

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b border-slate-300 bg-[#DDE2E2] text-left">

                {[
                  "Número",
                  "Cliente",
                  "Fecha",
                  "Origen",
                  "Total",
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

              {facturasFiltradas.map(
                (factura) => (

                  <tr
                    key={factura.id}
                    className="border-b border-slate-300/70 transition last:border-0 hover:bg-[#F5F7F7]"
                  >

                    <td className="px-5 py-4 text-sm font-bold text-[#0F766E]">
                      {factura.numero}
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-[#1C2526]">
                      {factura.cliente}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {factura.fecha}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {factura.origen}
                    </td>

                    <td className="px-5 py-4 text-sm font-bold text-slate-700">
                      {formatearDinero(
                        factura.total
                      )}
                    </td>

                    <td className="px-5 py-4">

                      <Estado
                        estado={
                          factura.estado
                        }
                      />

                    </td>

                    <td className="px-5 py-4 text-right">

                      <button
                        type="button"
                        onClick={() =>
                          setFacturaSeleccionada(
                            factura
                          )
                        }
                        className="rounded-lg px-3 py-1.5 text-sm font-semibold text-[#0F766E] transition hover:bg-[#BFEDE7]"
                      >
                        Ver
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          eliminarFactura(
                            factura.id
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
            {facturasFiltradas.length} de{" "}
            {facturas.length} facturas
          </p>

        </div>

      </section>

      {/* VER FACTURA */}

      <InvoiceDetailPanel
        factura={facturaSeleccionada}
        cerrar={() =>
          setFacturaSeleccionada(null)
        }
        cambiarEstado={cambiarEstado}
      />

      {/* NUEVA FACTURA */}

      {panelAbierto && (

        <NewInvoicePanel
          cerrar={() =>
            setPanelAbierto(false)
          }
          guardar={guardarFactura}
        />

      )}

    </>
  );
}

/* ==========================================================
   COMPONENTES AUXILIARES
========================================================== */

function TarjetaResumen({
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
      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${estilos[estado]}`}
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