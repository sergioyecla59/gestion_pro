"use client";

import { useCallback, useEffect, useState } from "react";

import NewDeliveryNotePanel, {
  Albaran,
  EstadoAlbaran,
  NuevoAlbaran,
} from "@/components/albaranes/NewDeliveryNotePanel";

import DeliveryNoteDetailPanel from "@/components/albaranes/DeliveryNoteDetailPanel";

/* ==========================================================
   TIPOS DE LA API
========================================================== */

type ClienteApi = {
  id: number;
  nombre: string;
};

type PedidoApi = {
  id: number;
  numero: string;
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

type AlbaranApi = {
  id: number;
  numero: string;
  fecha: string;
  estado: string;
  observaciones: string | null;
  pedido_id: number;
  cliente?: ClienteApi | null;
  pedido?: PedidoApi | null;
  lineas: LineaApi[];
};

/* ==========================================================
   ADAPTADOR API -> UI
========================================================== */

function formatearFecha(fecha: string) {
  const soloFecha = fecha.split("T")[0];

  const [anio, mes, dia] = soloFecha.split("-");

  if (!anio || !mes || !dia) {
    return fecha;
  }

  return `${dia}/${mes}/${anio}`;
}

function adaptarAlbaran(albaran: AlbaranApi): Albaran {
  return {
    id: albaran.id,
    numero: albaran.numero,
    pedido: albaran.pedido?.numero ?? "",
    cliente: albaran.cliente?.nombre ?? "Sin cliente",
    fecha: formatearFecha(albaran.fecha),
    estado: albaran.estado as EstadoAlbaran,
    observaciones: albaran.observaciones ?? "",
    lineas: albaran.lineas.map((linea) => ({
      id: linea.id,
      producto: linea.producto?.nombre ?? linea.descripcion,
      referencia: linea.producto?.referencia ?? "",
      cantidad: Number(linea.cantidad),
    })),
  };
}

/* ==========================================================
   ¿SE PUEDE ELIMINAR?

   Un albarán entregado ya refleja una entrega real:
   el backend lo bloquea y aquí ni se ofrece el botón.
========================================================== */

function sePuedeEliminar(estado: EstadoAlbaran): boolean {
  return estado !== "Entregado";
}

/* ==========================================================
   PÁGINA
========================================================== */

export default function AlbaranesPage() {
  const [albaranes, setAlbaranes] = useState<Albaran[]>([]);

  const [busqueda, setBusqueda] = useState("");

  const [filtroEstado, setFiltroEstado] = useState("Todos");

  const [panelAbierto, setPanelAbierto] = useState(false);

  const [albaranSeleccionado, setAlbaranSeleccionado] =
    useState<Albaran | null>(null);

  const [cargando, setCargando] = useState(true);

  const [error, setError] = useState("");

  /* ==========================================================
     CARGAR ALBARANES
  ========================================================== */

  const cargarAlbaranes = useCallback(async () => {
    try {
      setCargando(true);
      setError("");

      const respuesta = await fetch(
        "http://127.0.0.1:8000/api/albaranes"
      );

      if (!respuesta.ok) {
        throw new Error("No se pudieron cargar los albaranes.");
      }

      const datos: AlbaranApi[] = await respuesta.json();

      setAlbaranes(datos.map(adaptarAlbaran));
    } catch (error) {
      console.error(error);

      setError("No se pudieron cargar los albaranes.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    let cancelado = false;

    async function iniciarCarga() {
      if (cancelado) return;

      await cargarAlbaranes();
    }

    iniciarCarga();

    return () => {
      cancelado = true;
    };
  }, [cargarAlbaranes]);

  /* ==========================================================
     FILTRAR
  ========================================================== */

  const albaranesFiltrados = albaranes.filter((albaran) => {
    const texto = busqueda.toLowerCase();

    const coincideBusqueda =
      albaran.numero.toLowerCase().includes(texto) ||
      albaran.pedido.toLowerCase().includes(texto) ||
      albaran.cliente.toLowerCase().includes(texto);

    const coincideEstado =
      filtroEstado === "Todos" || albaran.estado === filtroEstado;

    return coincideBusqueda && coincideEstado;
  });

  /* ==========================================================
     GUARDAR DESDE EL PANEL
  ==========================================================
     El panel entrega un NuevoAlbaran (sin id, numero ni
     fecha). Este módulo no crea albaranes sueltos: el
     albarán nace siempre de un pedido, así que al recibir
     el formulario solo recargamos la lista para reflejar
     lo que haya en el servidor.
  ========================================================== */

  async function guardarAlbaran(
    _nuevoAlbaran: NuevoAlbaran
  ): Promise<void> {
    await cargarAlbaranes();
  }

  /* ==========================================================
     CAMBIAR ESTADO
  ==========================================================
     Al marcar "Entregado", el backend completa el pedido
     automáticamente. Solo hay que recargar para verlo.
  ========================================================== */

  async function cambiarEstado(id: number, estado: EstadoAlbaran) {
    try {
      setError("");

      const respuesta = await fetch(
        `http://127.0.0.1:8000/api/albaranes/${id}/estado`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ estado }),
        }
      );

      if (!respuesta.ok) {
        const detalle = await respuesta.json().catch(() => null);

        throw new Error(
          detalle?.message || "No se pudo cambiar el estado."
        );
      }

      const datos: AlbaranApi = await respuesta.json();

      const actualizado = adaptarAlbaran(datos);

      setAlbaranes((actuales) =>
        actuales.map((albaran) =>
          albaran.id === id ? actualizado : albaran
        )
      );

      setAlbaranSeleccionado((actual) =>
        actual && actual.id === id ? actualizado : actual
      );
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "No se pudo cambiar el estado del albarán."
      );
    }
  }

  /* ==========================================================
     ELIMINAR
  ==========================================================
     Solo se ofrece en albaranes no entregados. El
     backend lo vuelve a comprobar por si acaso.
  ========================================================== */

  async function eliminarAlbaran(id: number) {
    const confirmado = window.confirm(
      "¿Seguro que quieres eliminar este albarán?"
    );

    if (!confirmado) return;

    try {
      setError("");

      const respuesta = await fetch(
        `http://127.0.0.1:8000/api/albaranes/${id}`,
        {
          method: "DELETE",
          headers: { Accept: "application/json" },
        }
      );

      if (!respuesta.ok) {
        const detalle = await respuesta.json().catch(() => null);

        throw new Error(
          detalle?.message || "No se pudo eliminar el albarán."
        );
      }

      setAlbaranes((actuales) =>
        actuales.filter((albaran) => albaran.id !== id)
      );

      if (albaranSeleccionado?.id === id) {
        setAlbaranSeleccionado(null);
      }
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "No se pudo eliminar el albarán."
      );
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
          onClick={() => setPanelAbierto(true)}
          className="rounded-xl bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#115E59]"
        >
          + Nuevo albarán
        </button>
      </section>

      {/* AVISO DE FLUJO */}

      <div className="mt-4 rounded-xl border border-[#5EEAD4]/25 bg-[#0F766E]/10 px-4 py-3">
        <p className="text-xs font-semibold text-[#5EEAD4]">
          Los albaranes se crean desde un pedido
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-400">
          Abre un pedido en estado Preparando o Enviado y pulsa
          &quot;Crear albarán&quot;. El pedido pasará a Enviado
          automáticamente, y al marcar el albarán como Entregado,
          el pedido se completará solo.
        </p>
      </div>

      {/* ERROR */}

      {error && (
        <div className="mt-4 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-200">
          {error}
        </div>
      )}

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
              onChange={(event) => setBusqueda(event.target.value)}
              placeholder="Buscar albarán, pedido, cliente..."
              className="h-10 w-full rounded-xl border border-slate-300 bg-[#F5F7F7] pl-11 pr-4 text-sm text-slate-800 outline-none focus:border-[#0F766E]"
            />
          </div>

          <select
            value={filtroEstado}
            onChange={(event) => setFiltroEstado(event.target.value)}
            className="rounded-xl border border-slate-300 bg-[#F5F7F7] px-4 py-2.5 text-sm font-medium text-slate-600 outline-none focus:border-[#0F766E]"
          >
            <option value="Todos">Todos los estados</option>
            <option value="Pendiente">Pendientes</option>
            <option value="Preparado">Preparados</option>
            <option value="Entregado">Entregados</option>
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
              {cargando && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-8 text-center text-sm text-slate-500"
                  >
                    Cargando albaranes...
                  </td>
                </tr>
              )}

              {!cargando && albaranesFiltrados.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-8 text-center text-sm text-slate-500"
                  >
                    No hay albaranes que mostrar.
                  </td>
                </tr>
              )}

              {!cargando &&
                albaranesFiltrados.map((albaran) => (
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
                        (total, linea) => total + linea.cantidad,
                        0
                      )}{" "}
                      uds.
                    </td>

                    <td className="px-5 py-4">
                      <Estado estado={albaran.estado} />
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => setAlbaranSeleccionado(albaran)}
                        className="rounded-lg px-3 py-1.5 text-sm font-semibold text-[#0F766E] transition hover:bg-[#BFEDE7]"
                      >
                        Ver
                      </button>

                      {/*
                        El botón solo aparece si el albarán
                        todavía se puede eliminar.
                      */}
                      {sePuedeEliminar(albaran.estado) && (
                        <button
                          type="button"
                          onClick={() => eliminarAlbaran(albaran.id)}
                          className="rounded-lg px-3 py-1.5 text-sm font-semibold text-red-500 transition hover:bg-red-50"
                        >
                          Eliminar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* PIE */}

        <div className="border-t border-slate-300 px-5 py-4">
          <p className="text-xs text-slate-500">
            Mostrando {albaranesFiltrados.length} de {albaranes.length}{" "}
            albaranes
          </p>
        </div>
      </section>

      {/* VER ALBARÁN */}

      <DeliveryNoteDetailPanel
        albaran={albaranSeleccionado}
        cerrar={() => setAlbaranSeleccionado(null)}
        cambiarEstado={cambiarEstado}
      />

      {/* NUEVO ALBARÁN */}

      {panelAbierto && (
        <NewDeliveryNotePanel
          cerrar={() => setPanelAbierto(false)}
          guardar={guardarAlbaran}
        />
      )}
    </>
  );
}

/* ==========================================================
   ESTADO
========================================================== */

function Estado({ estado }: { estado: EstadoAlbaran }) {
  const estilos: Record<EstadoAlbaran, string> = {
    Pendiente: "bg-amber-100 text-amber-700",

    Preparado: "bg-blue-100 text-blue-700",

    Entregado: "bg-emerald-100 text-emerald-700",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${estilos[estado]}`}
    >
      {estado}
    </span>
  );
}