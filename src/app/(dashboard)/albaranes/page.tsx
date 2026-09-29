"use client";

import { useState } from "react";

import NewDeliveryNotePanel, {
  Albaran,
  EstadoAlbaran,
  NuevoAlbaran,
} from "@/components/albaranes/NewDeliveryNotePanel";

import DeliveryNoteDetailPanel from "@/components/albaranes/DeliveryNoteDetailPanel";

const albaranesIniciales: Albaran[] = [
  {
    id: 1,
    numero: "ALB-2026-001",
    pedido: "PED-2026-001",
    cliente: "Muebles García",
    fecha: "24/09/2026",
    estado: "Preparado",
    lineas: [
      {
        id: 1,
        producto: "Colchón Premium Visco",
        referencia: "COL-001",
        cantidad: 2,
      },
    ],
    observaciones:
      "Entrega prevista en horario de mañana.",
  },
  {
    id: 2,
    numero: "ALB-2026-002",
    pedido: "PED-2026-003",
    cliente: "Descanso Levante",
    fecha: "23/09/2026",
    estado: "Entregado",
    lineas: [
      {
        id: 2,
        producto: "Almohada Viscoelástica",
        referencia: "ALM-001",
        cantidad: 10,
      },
    ],
    observaciones:
      "Mercancía entregada correctamente.",
  },
  {
    id: 3,
    numero: "ALB-2026-003",
    pedido: "PED-2026-002",
    cliente: "Sofás Martínez",
    fecha: "24/09/2026",
    estado: "Pendiente",
    lineas: [
      {
        id: 3,
        producto: "Canapé Abatible",
        referencia: "CAN-001",
        cantidad: 2,
      },
    ],
    observaciones: "",
  },
];

export default function AlbaranesPage() {
  const [albaranes, setAlbaranes] =
    useState<Albaran[]>(
      albaranesIniciales
    );

  const [busqueda, setBusqueda] =
    useState("");

  const [filtroEstado, setFiltroEstado] =
    useState("Todos");

  const [panelAbierto, setPanelAbierto] =
    useState(false);

  const [
    albaranSeleccionado,
    setAlbaranSeleccionado,
  ] = useState<Albaran | null>(null);

  /* ==========================================================
     FILTRAR
  ========================================================== */

  const albaranesFiltrados =
    albaranes.filter((albaran) => {
      const texto =
        busqueda.toLowerCase();

      const coincideBusqueda =
        albaran.numero
          .toLowerCase()
          .includes(texto) ||
        albaran.pedido
          .toLowerCase()
          .includes(texto) ||
        albaran.cliente
          .toLowerCase()
          .includes(texto);

      const coincideEstado =
        filtroEstado === "Todos" ||
        albaran.estado === filtroEstado;

      return (
        coincideBusqueda &&
        coincideEstado
      );
    });

  /* ==========================================================
     CREAR
  ========================================================== */

  function guardarAlbaran(
    nuevoAlbaran: NuevoAlbaran
  ) {
    const siguienteNumero =
      albaranes.length + 1;

    const albaran: Albaran = {
      id: Date.now(),

      numero: `ALB-2026-${String(
        siguienteNumero
      ).padStart(3, "0")}`,

      fecha:
        new Date().toLocaleDateString(
          "es-ES"
        ),

      ...nuevoAlbaran,
    };

    setAlbaranes((actuales) => [
      albaran,
      ...actuales,
    ]);
  }

  /* ==========================================================
     CAMBIAR ESTADO
  ========================================================== */

  function cambiarEstado(
    id: number,
    estado: EstadoAlbaran
  ) {
    setAlbaranes((actuales) =>
      actuales.map((albaran) =>
        albaran.id === id
          ? {
              ...albaran,
              estado,
            }
          : albaran
      )
    );

    setAlbaranSeleccionado(
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

  function eliminarAlbaran(id: number) {
    const confirmado =
      window.confirm(
        "¿Seguro que quieres eliminar este albarán?"
      );

    if (!confirmado) return;

    setAlbaranes((actuales) =>
      actuales.filter(
        (albaran) =>
          albaran.id !== id
      )
    );

    if (
      albaranSeleccionado?.id === id
    ) {
      setAlbaranSeleccionado(null);
    }
  }

  return (
    <>
      {/* CABECERA */}

      <section className="flex items-end justify-between">

        <div>

          <p className="mb-1 text-xs font-bold uppercase tracking-[0.14em] text-[#5EEAD4]">
            Ventas
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-white">
            Albaranes
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Gestiona las entregas de mercancía asociadas a tus pedidos.
          </p>

        </div>

        <button
          type="button"
          onClick={() =>
            setPanelAbierto(true)
          }
          className="rounded-xl bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#115E59]"
        >
          + Nuevo albarán
        </button>

      </section>

      {/* TABLA */}

      <section className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[#E8ECEC] shadow-xl shadow-black/10">

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
              placeholder="Buscar albarán, pedido, cliente..."
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

            <option value="Preparado">
              Preparados
            </option>

            <option value="Entregado">
              Entregados
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
                  "Pedido",
                  "Cliente",
                  "Fecha",
                  "Productos",
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

              {albaranesFiltrados.map(
                (albaran) => (

                  <tr
                    key={albaran.id}
                    className="border-b border-slate-300/70 transition last:border-0 hover:bg-[#F5F7F7]"
                  >

                    <td className="px-5 py-4 text-sm font-bold text-[#0F766E]">
                      {albaran.numero}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {albaran.pedido}
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-[#1C2526]">
                      {albaran.cliente}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {albaran.fecha}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {albaran.lineas.reduce(
                        (total, linea) =>
                          total +
                          linea.cantidad,
                        0
                      )}{" "}
                      uds.
                    </td>

                    <td className="px-5 py-4">

                      <Estado
                        estado={
                          albaran.estado
                        }
                      />

                    </td>

                    <td className="px-5 py-4 text-right">

                      <button
                        type="button"
                        onClick={() =>
                          setAlbaranSeleccionado(
                            albaran
                          )
                        }
                        className="rounded-lg px-3 py-1.5 text-sm font-semibold text-[#0F766E] transition hover:bg-[#BFEDE7]"
                      >
                        Ver
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          eliminarAlbaran(
                            albaran.id
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
            {albaranesFiltrados.length} de{" "}
            {albaranes.length} albaranes
          </p>

        </div>

      </section>

      {/* VER ALBARÁN */}

      <DeliveryNoteDetailPanel
        albaran={albaranSeleccionado}
        cerrar={() =>
          setAlbaranSeleccionado(null)
        }
        cambiarEstado={cambiarEstado}
      />

      {/* NUEVO ALBARÁN */}

      {panelAbierto && (

        <NewDeliveryNotePanel
          cerrar={() =>
            setPanelAbierto(false)
          }
          guardar={guardarAlbaran}
        />

      )}

    </>
  );
}

/* ==========================================================
   ESTADO
========================================================== */

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
      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${estilos[estado]}`}
    >
      {estado}
    </span>
  );
}