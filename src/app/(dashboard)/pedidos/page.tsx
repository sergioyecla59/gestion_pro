"use client";

import { useState } from "react";

import NewOrderPanel, {
  EstadoPedido,
  NuevoPedido,
  Pedido,
} from "@/components/pedidos/NewOrderPanel";

import OrderDetailPanel from "@/components/pedidos/OrderDetailPanel";

const pedidosIniciales: Pedido[] = [
  {
    id: 1,
    numero: "PED-2026-001",
    cliente: "Muebles García",
    fecha: "24/09/2026",
    estado: "Preparando",
    origen: "PRE-2026-001",
    lineas: [
      {
        id: 1,
        producto: "Colchón Premium Visco",
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
    numero: "PED-2026-002",
    cliente: "Sofás Martínez",
    fecha: "23/09/2026",
    estado: "Pendiente",
    origen: "Pedido manual",
    lineas: [
      {
        id: 2,
        producto: "Canapé Abatible",
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
    numero: "PED-2026-003",
    cliente: "Descanso Levante",
    fecha: "21/09/2026",
    estado: "Enviado",
    origen: "PRE-2026-003",
    lineas: [
      {
        id: 3,
        producto: "Almohada Viscoelástica",
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

export default function PedidosPage() {
  const [pedidos, setPedidos] =
    useState<Pedido[]>(pedidosIniciales);

  const [busqueda, setBusqueda] =
    useState("");

  const [filtroEstado, setFiltroEstado] =
    useState("Todos");

  const [panelAbierto, setPanelAbierto] =
    useState(false);

  const [
    pedidoSeleccionado,
    setPedidoSeleccionado,
  ] = useState<Pedido | null>(null);

  /* ==========================================================
     FILTRAR
  ========================================================== */

  const pedidosFiltrados = pedidos.filter(
    (pedido) => {
      const texto = busqueda.toLowerCase();

      const coincideBusqueda =
        pedido.numero
          .toLowerCase()
          .includes(texto) ||
        pedido.cliente
          .toLowerCase()
          .includes(texto) ||
        pedido.origen
          .toLowerCase()
          .includes(texto);

      const coincideEstado =
        filtroEstado === "Todos" ||
        pedido.estado === filtroEstado;

      return coincideBusqueda && coincideEstado;
    }
  );

  /* ==========================================================
     CREAR
  ========================================================== */

  function guardarPedido(
    nuevoPedido: NuevoPedido
  ) {
    const subtotal =
      nuevoPedido.lineas.reduce(
        (total, linea) =>
          total +
          linea.precio * linea.cantidad,
        0
      );

    const iva = subtotal * 0.21;
    const total = subtotal + iva;

    const siguienteNumero =
      pedidos.length + 1;

    const pedido: Pedido = {
      id: Date.now(),

      numero: `PED-2026-${String(
        siguienteNumero
      ).padStart(3, "0")}`,

      fecha: new Date().toLocaleDateString(
        "es-ES"
      ),

      ...nuevoPedido,

      subtotal,
      iva,
      total,
    };

    setPedidos((actuales) => [
      pedido,
      ...actuales,
    ]);
  }

  /* ==========================================================
     CAMBIAR ESTADO
  ========================================================== */

  function cambiarEstado(
    id: number,
    estado: EstadoPedido
  ) {
    setPedidos((actuales) =>
      actuales.map((pedido) =>
        pedido.id === id
          ? {
              ...pedido,
              estado,
            }
          : pedido
      )
    );

    setPedidoSeleccionado((actual) =>
      actual && actual.id === id
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

  function eliminarPedido(id: number) {
    const confirmado = window.confirm(
      "¿Seguro que quieres eliminar este pedido?"
    );

    if (!confirmado) return;

    setPedidos((actuales) =>
      actuales.filter(
        (pedido) => pedido.id !== id
      )
    );
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
            Pedidos
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Gestiona los pedidos y su proceso de preparación y entrega.
          </p>

        </div>

        <button
          onClick={() =>
            setPanelAbierto(true)
          }
          className="rounded-xl bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#115E59]"
        >
          + Nuevo pedido
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
                setBusqueda(event.target.value)
              }
              placeholder="Buscar pedido, cliente..."
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

            <option value="Preparando">
              Preparando
            </option>

            <option value="Enviado">
              Enviados
            </option>

            <option value="Completado">
              Completados
            </option>

            <option value="Cancelado">
              Cancelados
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

              {pedidosFiltrados.map(
                (pedido) => (

                  <tr
                    key={pedido.id}
                    className="border-b border-slate-300/70 transition last:border-0 hover:bg-[#F5F7F7]"
                  >

                    <td className="px-5 py-4 text-sm font-bold text-[#0F766E]">
                      {pedido.numero}
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-[#1C2526]">
                      {pedido.cliente}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {pedido.fecha}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {pedido.origen}
                    </td>

                    <td className="px-5 py-4 text-sm font-bold text-slate-700">
                      {formatearDinero(
                        pedido.total
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <Estado
                        estado={pedido.estado}
                      />
                    </td>

                    <td className="px-5 py-4 text-right">

                      <button
                        onClick={() =>
                          setPedidoSeleccionado(
                            pedido
                          )
                        }
                        className="rounded-lg px-3 py-1.5 text-sm font-semibold text-[#0F766E] transition hover:bg-[#BFEDE7]"
                      >
                        Ver
                      </button>

                      <button
                        onClick={() =>
                          eliminarPedido(
                            pedido.id
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
            {pedidosFiltrados.length} de{" "}
            {pedidos.length} pedidos
          </p>

        </div>

      </section>

      {/* VER PEDIDO */}

      <OrderDetailPanel
        pedido={pedidoSeleccionado}
        cerrar={() =>
          setPedidoSeleccionado(null)
        }
        cambiarEstado={cambiarEstado}
      />

      {/* NUEVO PEDIDO */}

      {panelAbierto && (
        <NewOrderPanel
          cerrar={() =>
            setPanelAbierto(false)
          }
          guardar={guardarPedido}
        />
      )}

    </>
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