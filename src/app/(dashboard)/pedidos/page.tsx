"use client";

import { useCallback, useEffect, useState } from "react";

import NewOrderPanel, {
  EstadoPedido,
  NuevoPedido,
  Pedido,
} from "@/components/pedidos/NewOrderPanel";

import OrderDetailPanel from "@/components/pedidos/OrderDetailPanel";

/* ==========================================================
   TIPOS DE LA API
========================================================== */

type ClienteApi = {
  id: number;
  nombre: string;
};

type LineaApi = {
  id: number;
  producto_id: number | null;
  descripcion: string;
  cantidad: string | number;
  precio_unitario: string | number;
  porcentaje_iva: string | number;
  subtotal: string | number;
  producto?: {
    id: number;
    referencia: string;
    nombre: string;
  } | null;
};

type PedidoApi = {
  id: number;
  numero: string;
  cliente_id: number;
  fecha: string;
  estado: string;
  origen: string | null;
  subtotal: string | number;
  iva: string | number;
  total: string | number;
  cliente?: ClienteApi | null;
  lineas: LineaApi[];
};

/* ==========================================================
   ADAPTADOR API -> UI
========================================================== */

function formatearFecha(fecha: string) {
  const soloFecha = fecha.split("T")[0];

  const partes = soloFecha.split("-");

  if (partes.length !== 3) {
    return fecha;
  }

  return partes[2] + "/" + partes[1] + "/" + partes[0];
}

function adaptarPedido(pedido: PedidoApi): Pedido {
  const cliente = pedido.cliente;
  const lineas = pedido.lineas || [];

  return {
    id: pedido.id,
    numero: pedido.numero,
    clienteId: pedido.cliente_id,
    cliente: cliente ? cliente.nombre : "Sin cliente",
    fecha: formatearFecha(pedido.fecha),
    estado: pedido.estado as EstadoPedido,
    origen: pedido.origen || "",
    lineas: lineas.map((linea) => {
      const producto = linea.producto;
      return {
        id: linea.id,
        productoId: linea.producto_id || 0,
        producto: producto ? producto.nombre : linea.descripcion,
        referencia: producto ? producto.referencia : "",
        cantidad: Number(linea.cantidad),
        precio: Number(linea.precio_unitario),
      };
    }),
    subtotal: Number(pedido.subtotal),
    iva: Number(pedido.iva),
    total: Number(pedido.total),
  };
}

/* ==========================================================
   PÁGINA
========================================================== */

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  const [busqueda, setBusqueda] = useState("");

  const [filtroEstado, setFiltroEstado] = useState("Todos");

  const [panelAbierto, setPanelAbierto] = useState(false);

  const [pedidoSeleccionado, setPedidoSeleccionado] =
    useState<Pedido | null>(null);

  const [cargando, setCargando] = useState(true);

  const [error, setError] = useState("");

  /* ==========================================================
     CARGAR PEDIDOS
  ========================================================== */

  const cargarPedidos = useCallback(async () => {
    try {
      setCargando(true);
      setError("");

      const respuesta = await fetch("http://127.0.0.1:8000/api/pedidos");

      if (!respuesta.ok) {
        throw new Error("No se pudieron cargar los pedidos.");
      }

      const datos: PedidoApi[] = await respuesta.json();

      setPedidos(datos.map(adaptarPedido));
    } catch (err) {
      console.error(err);

      setError("No se pudieron cargar los pedidos.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    let cancelado = false;

    async function iniciarCarga() {
      if (cancelado) return;

      await cargarPedidos();
    }

    iniciarCarga();

    return () => {
      cancelado = true;
    };
  }, [cargarPedidos]);

  /* ==========================================================
     FILTRAR
  ========================================================== */

  const pedidosFiltrados = pedidos.filter((pedido) => {
    const texto = busqueda.toLowerCase();

    const coincideBusqueda =
      pedido.numero.toLowerCase().includes(texto) ||
      pedido.cliente.toLowerCase().includes(texto) ||
      pedido.origen.toLowerCase().includes(texto);

    const coincideEstado =
      filtroEstado === "Todos" || pedido.estado === filtroEstado;

    return coincideBusqueda && coincideEstado;
  });

  /* ==========================================================
     CREAR
  ========================================================== */

  async function guardarPedido(nuevoPedido: NuevoPedido): Promise<boolean> {
    try {
      setError("");

      const lineas = nuevoPedido.lineas.map((linea) => {
        return {
          producto_id: linea.productoId,
          descripcion: linea.producto,
          cantidad: linea.cantidad,
          precio_unitario: linea.precio,
          porcentaje_iva: 21,
        };
      });

      const respuesta = await fetch("http://127.0.0.1:8000/api/pedidos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          empresa_id: 1,
          cliente_id: nuevoPedido.clienteId,
          fecha: new Date().toISOString().split("T")[0],
          origen: nuevoPedido.origen,
          estado: nuevoPedido.estado,
          lineas: lineas,
        }),
      });

      if (!respuesta.ok) {
        const detalle = await respuesta.json().catch(() => null);

        console.error(detalle);

        setError("No se pudo guardar el pedido. Revisa los datos.");

        return false;
      }

      await cargarPedidos();

      return true;
    } catch (err) {
      console.error(err);

      setError("Ha ocurrido un error al guardar el pedido.");

      return false;
    }
  }

  /* ==========================================================
     CAMBIAR ESTADO
  ========================================================== */

  async function cambiarEstado(id: number, estado: EstadoPedido) {
    try {
      const respuesta = await fetch(
        "http://127.0.0.1:8000/api/pedidos/" + id + "/estado",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ estado: estado }),
        }
      );

      if (!respuesta.ok) {
        const detalle = await respuesta.json().catch(() => null);

        throw new Error(
          detalle ? detalle.message : "No se pudo cambiar el estado."
        );
      }

      setPedidos((actuales) =>
        actuales.map((pedido) =>
          pedido.id === id ? { ...pedido, estado: estado } : pedido
        )
      );

      setPedidoSeleccionado((actual) =>
        actual && actual.id === id ? { ...actual, estado: estado } : actual
      );
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "No se pudo cambiar el estado del pedido."
      );
    }
  }

  /* ==========================================================
     ELIMINAR
  ========================================================== */

  async function eliminarPedido(id: number) {
    const confirmado = window.confirm(
      "¿Seguro que quieres eliminar este pedido?"
    );

    if (!confirmado) return;

    try {
      setError("");

      const respuesta = await fetch(
        "http://127.0.0.1:8000/api/pedidos/" + id,
        {
          method: "DELETE",
          headers: { Accept: "application/json" },
        }
      );

      if (!respuesta.ok) {
        const detalle = await respuesta.json().catch(() => null);

        throw new Error(
          detalle ? detalle.message : "No se pudo eliminar el pedido."
        );
      }

      setPedidos((actuales) => actuales.filter((pedido) => pedido.id !== id));

      setPedidoSeleccionado((actual) =>
        actual && actual.id === id ? null : actual
      );
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error ? err.message : "No se pudo eliminar el pedido."
      );
    }
  }

  /* ==========================================================
     RENDER
  ========================================================== */

  const columnas = [
    "Número",
    "Cliente",
    "Fecha",
    "Origen",
    "Total",
    "Estado",
    "Acciones",
  ];

  return (
    <div>
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
          onClick={() => setPanelAbierto(true)}
          className="rounded-xl bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#115E59]"
        >
          + Nuevo pedido
        </button>
      </section>

      {error ? (
        <div className="mt-4 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-200">
          {error}
        </div>
      ) : null}

      <section className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[#E8ECEC] shadow-xl shadow-black/10">
        <div className="flex items-center justify-between gap-4 border-b border-slate-300 p-5">
          <div className="relative w-full max-w-sm">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              ⌕
            </span>

            <input
              value={busqueda}
              onChange={(evento) => setBusqueda(evento.target.value)}
              placeholder="Buscar pedido, cliente..."
              className="h-10 w-full rounded-xl border border-slate-300 bg-[#F5F7F7] pl-11 pr-4 text-sm text-slate-800 outline-none focus:border-[#0F766E]"
            />
          </div>

          <select
            value={filtroEstado}
            onChange={(evento) => setFiltroEstado(evento.target.value)}
            className="rounded-xl border border-slate-300 bg-[#F5F7F7] px-4 py-2.5 text-sm font-medium text-slate-600 outline-none focus:border-[#0F766E]"
          >
            <option value="Todos">Todos los estados</option>
            <option value="Pendiente">Pendientes</option>
            <option value="Preparando">Preparando</option>
            <option value="Enviado">Enviados</option>
            <option value="Completado">Completados</option>
            <option value="Anulado">Anulados</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-300 bg-[#DDE2E2] text-left">
                {columnas.map((titulo) => (
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
              {cargando ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-8 text-center text-sm text-slate-500"
                  >
                    Cargando pedidos...
                  </td>
                </tr>
              ) : null}

              {!cargando && pedidosFiltrados.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-8 text-center text-sm text-slate-500"
                  >
                    No hay pedidos que mostrar.
                  </td>
                </tr>
              ) : null}

              {!cargando
                ? pedidosFiltrados.map((pedido) => (
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
                        {formatearDinero(pedido.total)}
                      </td>

                      <td className="px-5 py-4">
                        <Estado estado={pedido.estado} />
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => setPedidoSeleccionado(pedido)}
                          className="rounded-lg px-3 py-1.5 text-sm font-semibold text-[#0F766E] transition hover:bg-[#BFEDE7]"
                        >
                          Ver
                        </button>

                        {pedido.estado !== "Anulado" ? (
                          <button
                            onClick={() => eliminarPedido(pedido.id)}
                            className="rounded-lg px-3 py-1.5 text-sm font-semibold text-red-500 transition hover:bg-red-50"
                          >
                            Eliminar
                          </button>
                        ) : null}
                      </td>
                    </tr>
                  ))
                : null}
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-300 px-5 py-4">
          <p className="text-xs text-slate-500">
            Mostrando {pedidosFiltrados.length} de {pedidos.length} pedidos
          </p>
        </div>
      </section>

      <OrderDetailPanel
        pedido={pedidoSeleccionado}
        cerrar={() => setPedidoSeleccionado(null)}
        cambiarEstado={cambiarEstado}
        alCrearAlbaran={() => {
          cargarPedidos();
          setPedidoSeleccionado(null);
        }}
        alAnular={() => {
          cargarPedidos();
          setPedidoSeleccionado(null);
        }}
      />

      {panelAbierto ? (
        <NewOrderPanel
          cerrar={() => setPanelAbierto(false)}
          guardar={guardarPedido}
        />
      ) : null}
    </div>
  );
}

/* ==========================================================
   ESTADO
========================================================== */

function Estado({ estado }: { estado: EstadoPedido }) {
  const estilos: Record<EstadoPedido, string> = {
    Pendiente: "bg-amber-100 text-amber-700",
    Preparando: "bg-blue-100 text-blue-700",
    Enviado: "bg-violet-100 text-violet-700",
    Completado: "bg-emerald-100 text-emerald-700",
    Anulado: "bg-slate-200 text-slate-600",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${estilos[estado]}`}
    >
      {estado}
    </span>
  );
}

/* ==========================================================
   FORMATEAR DINERO
========================================================== */

function formatearDinero(cantidad: number) {
  const numero = cantidad.toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return numero + " €";
}