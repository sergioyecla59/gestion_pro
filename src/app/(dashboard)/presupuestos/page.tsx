"use client";

import { useEffect, useState } from "react";

import NewBudgetPanel, {
  DatosPresupuesto,
  Presupuesto,
} from "@/components/presupuestos/NewBudgetPanel";

import BudgetDetailPanel from "@/components/presupuestos/BudgetDetailPanel";

/* ==========================================================
   API
========================================================== */

type PresupuestoApi = {
  id: number;
  empresa_id: number;
  cliente_id: number;
  numero: string;
  fecha: string;
  valido_hasta: string | null;

  estado: "Pendiente" | "Aceptado" | "Rechazado";

  base_imponible: string | number;
  iva: string | number;
  total: string | number;

  cliente: {
    id: number;
    nombre: string;
    email: string | null;
  };

  lineas: {
    id: number;
    producto_id: number | null;
    descripcion: string;
    cantidad: string | number;
    precio_unitario: string | number;
    porcentaje_iva: string | number;
    subtotal: string | number;

    producto: {
      id: number;
      nombre: string;
      referencia: string;
    } | null;
  }[];
};

/* ==========================================================
   ADAPTADOR
========================================================== */

function adaptarPresupuesto(presupuesto: PresupuestoApi): Presupuesto {
  return {
    id: presupuesto.id,
    numero: presupuesto.numero,
    clienteId: presupuesto.cliente_id,

    cliente: presupuesto.cliente?.nombre ?? "Cliente",
    clienteEmail: presupuesto.cliente?.email ?? "",

    fecha: formatearFecha(presupuesto.fecha),

    validez: calcularValidez(presupuesto.fecha, presupuesto.valido_hasta),

    estado: presupuesto.estado,

    lineas: presupuesto.lineas.map((linea) => ({
      id: linea.id,

      productoId: linea.producto_id ?? 0,

      producto: linea.producto?.nombre ?? linea.descripcion,

      referencia: linea.producto?.referencia ?? "",

      cantidad: Number(linea.cantidad),

      precio: Number(linea.precio_unitario),
    })),

    subtotal: Number(presupuesto.base_imponible),

    iva: Number(presupuesto.iva),
    total: Number(presupuesto.total),
  };
}

/* ==========================================================
   PÁGINA
========================================================== */

export default function PresupuestosPage() {
  const [presupuestos, setPresupuestos] = useState<Presupuesto[]>([]);

  const [busqueda, setBusqueda] = useState("");

  const [filtroEstado, setFiltroEstado] = useState("Todos");

  const [panelNuevo, setPanelNuevo] = useState(false);

  const [presupuestoSeleccionado, setPresupuestoSeleccionado] =
    useState<Presupuesto | null>(null);

  const [presupuestoEditar, setPresupuestoEditar] =
    useState<Presupuesto | null>(null);

  const [cargando, setCargando] = useState(true);

  const [error, setError] = useState("");

  /* ==========================================================
   CARGAR PRESUPUESTOS
========================================================== */

  useEffect(() => {
    async function cargarPresupuestos() {
      try {
        setCargando(true);
        setError("");

        const respuesta = await fetch("http://127.0.0.1:8000/api/presupuestos");

        if (!respuesta.ok) {
          throw new Error("No se pudieron cargar los presupuestos.");
        }

        const datos: PresupuestoApi[] = await respuesta.json();

        setPresupuestos(datos.map(adaptarPresupuesto));
      } catch (error) {
        console.error(error);

        setError("No se pudieron cargar los presupuestos.");
      } finally {
        setCargando(false);
      }
    }

    cargarPresupuestos();
  }, []);

  /* ==========================================================
     FILTROS
  ========================================================== */

  const presupuestosFiltrados = presupuestos.filter((presupuesto) => {
    const texto = busqueda.toLowerCase();

    const coincideBusqueda =
      presupuesto.numero.toLowerCase().includes(texto) ||
      presupuesto.cliente.toLowerCase().includes(texto);

    const coincideEstado =
      filtroEstado === "Todos" || presupuesto.estado === filtroEstado;

    return coincideBusqueda && coincideEstado;
  });

  /* ==========================================================
     CREAR
  ========================================================== */

  async function crearPresupuesto(datos: DatosPresupuesto): Promise<boolean> {
    try {
      setError("");

      const fecha = obtenerFechaHoy();

      const respuesta = await fetch("http://127.0.0.1:8000/api/presupuestos", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },

        body: JSON.stringify({
          empresa_id: 1,
          cliente_id: datos.clienteId,
          numero: generarNumeroPresupuesto(),
          fecha,

          valido_hasta: calcularFechaValidez(fecha, datos.validez),

          estado: datos.estado,

          lineas: datos.lineas.map((linea) => ({
            producto_id: linea.productoId,

            descripcion: linea.producto,

            cantidad: linea.cantidad,

            precio_unitario: linea.precio,

            porcentaje_iva: 21,
          })),
        }),
      });

      if (!respuesta.ok) {
        const datosError = await respuesta.json();

        throw new Error(
          datosError.message ?? "No se pudo crear el presupuesto.",
        );
      }

      const creado: PresupuestoApi = await respuesta.json();

      setPresupuestos((actuales) => [adaptarPresupuesto(creado), ...actuales]);

      return true;
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "No se pudo crear el presupuesto.",
      );

      return false;
    }
  }

  /* ==========================================================
     EDITAR
  ========================================================== */

  async function editarPresupuesto(datos: DatosPresupuesto): Promise<boolean> {
    if (!presupuestoEditar) {
      return false;
    }

    try {
      setError("");

      const fechaOriginal = convertirFechaApi(presupuestoEditar.fecha);

      const respuesta = await fetch(
        `http://127.0.0.1:8000/api/presupuestos/${presupuestoEditar.id}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },

          body: JSON.stringify({
            empresa_id: 1,

            cliente_id: datos.clienteId,

            numero: presupuestoEditar.numero,

            fecha: fechaOriginal,

            valido_hasta: calcularFechaValidez(fechaOriginal, datos.validez),

            estado: datos.estado,

            lineas: datos.lineas.map((linea) => ({
              producto_id: linea.productoId,

              descripcion: linea.producto,

              cantidad: linea.cantidad,

              precio_unitario: linea.precio,

              porcentaje_iva: 21,
            })),
          }),
        },
      );

      if (!respuesta.ok) {
        const datosError = await respuesta.json();

        console.error("Laravel:", datosError);

        throw new Error(
          datosError.message ?? "No se pudo editar el presupuesto.",
        );
      }

      const actualizado: PresupuestoApi = await respuesta.json();

      const adaptado = adaptarPresupuesto(actualizado);

      setPresupuestos((actuales) =>
        actuales.map((presupuesto) =>
          presupuesto.id === adaptado.id ? adaptado : presupuesto,
        ),
      );

      setPresupuestoSeleccionado(adaptado);

      setPresupuestoEditar(null);

      return true;
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "No se pudo editar el presupuesto.",
      );

      return false;
    }
  }

  /* ==========================================================
     ELIMINAR
  ========================================================== */

  async function eliminarPresupuesto(id: number) {
    const confirmado = window.confirm(
      "¿Seguro que quieres eliminar este presupuesto?",
    );

    if (!confirmado) return;

    try {
      setError("");

      const respuesta = await fetch(
        `http://127.0.0.1:8000/api/presupuestos/${id}`,
        {
          method: "DELETE",

          headers: {
            Accept: "application/json",
          },
        },
      );

      if (!respuesta.ok) {
        throw new Error("No se pudo eliminar el presupuesto.");
      }

      setPresupuestos((actuales) =>
        actuales.filter((presupuesto) => presupuesto.id !== id),
      );

      if (presupuestoSeleccionado?.id === id) {
        setPresupuestoSeleccionado(null);
      }
    } catch (error) {
      console.error(error);

      setError("No se pudo eliminar el presupuesto.");
    }
  }

  /* ==========================================================
     ABRIR EDICIÓN
  ========================================================== */

  function abrirEdicion(presupuesto: Presupuesto) {
    setPresupuestoSeleccionado(null);
    setPresupuestoEditar(presupuesto);
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
            Presupuestos
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Crea y gestiona las ofertas comerciales de tus clientes.
          </p>
        </div>

        <button
          onClick={() => setPanelNuevo(true)}
          className="rounded-xl bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#115E59]"
        >
          + Nuevo presupuesto
        </button>
      </section>

      {/* ERROR */}

      {error && (
        <div className="mt-5 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-200">
          {error}
        </div>
      )}

      {/* TABLA */}

      <section className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[#E8ECEC] shadow-xl shadow-black/10">
        <div className="flex items-center justify-between gap-4 border-b border-slate-300 p-5">
          <div className="relative w-full max-w-sm">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              ⌕
            </span>

            <input
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
              placeholder="Buscar número o cliente..."
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

            <option value="Aceptado">Aceptados</option>

            <option value="Rechazado">Rechazados</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-300 bg-[#DDE2E2] text-left">
                {[
                  "Número",
                  "Cliente",
                  "Fecha",
                  "Validez",
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
              {cargando && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-10 text-center text-sm text-slate-500"
                  >
                    Cargando presupuestos...
                  </td>
                </tr>
              )}

              {!cargando && presupuestosFiltrados.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-10 text-center text-sm text-slate-500"
                  >
                    No hay presupuestos.
                  </td>
                </tr>
              )}

              {!cargando &&
                presupuestosFiltrados.map((presupuesto) => (
                  <tr
                    key={presupuesto.id}
                    className="border-b border-slate-300/70 transition last:border-0 hover:bg-[#F5F7F7]"
                  >
                    <td className="px-5 py-4 text-sm font-bold text-[#0F766E]">
                      {presupuesto.numero}
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-[#1C2526]">
                      {presupuesto.cliente}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {presupuesto.fecha}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {presupuesto.validez}
                    </td>

                    <td className="px-5 py-4 text-sm font-bold text-slate-700">
                      {formatearDinero(presupuesto.total)}
                    </td>

                    <td className="px-5 py-4">
                      <Estado estado={presupuesto.estado} />
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => setPresupuestoSeleccionado(presupuesto)}
                        className="rounded-lg px-3 py-1.5 text-sm font-semibold text-[#0F766E] hover:bg-[#BFEDE7]"
                      >
                        Ver
                      </button>

                      <button
                        onClick={() => abrirEdicion(presupuesto)}
                        className="rounded-lg px-3 py-1.5 text-sm font-semibold text-blue-600 hover:bg-blue-50"
                      >
                        Editar
                      </button>

                      <button
                        onClick={() => eliminarPresupuesto(presupuesto.id)}
                        className="rounded-lg px-3 py-1.5 text-sm font-semibold text-red-500 hover:bg-red-50"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-300 px-5 py-4">
          <p className="text-xs text-slate-500">
            Mostrando {presupuestosFiltrados.length} de {presupuestos.length}{" "}
            presupuestos
          </p>
        </div>
      </section>

      {/* VER */}

      <BudgetDetailPanel
        presupuesto={presupuestoSeleccionado}
        cerrar={() => setPresupuestoSeleccionado(null)}
        editar={abrirEdicion}
      />

      {/* CREAR */}

      {panelNuevo && (
        <NewBudgetPanel
          cerrar={() => setPanelNuevo(false)}
          guardar={crearPresupuesto}
        />
      )}

      {/* EDITAR */}

      {presupuestoEditar && (
        <NewBudgetPanel
          presupuestoEditar={presupuestoEditar}
          cerrar={() => setPresupuestoEditar(null)}
          guardar={editarPresupuesto}
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
  estado: "Pendiente" | "Aceptado" | "Rechazado";
}) {
  const estilos = {
    Pendiente: "bg-amber-100 text-amber-700",

    Aceptado: "bg-emerald-100 text-emerald-700",

    Rechazado: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${estilos[estado]}`}
    >
      {estado}
    </span>
  );
}

function formatearDinero(cantidad: number) {
  return `${cantidad.toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} €`;
}

/* ==========================================================
   FECHAS
========================================================== */

function obtenerFechaHoy() {
  const fecha = new Date();

  const año = fecha.getFullYear();

  const mes = String(fecha.getMonth() + 1).padStart(2, "0");

  const dia = String(fecha.getDate()).padStart(2, "0");

  return `${año}-${mes}-${dia}`;
}

function calcularFechaValidez(fecha: string, validez: string) {
  const dias = Number(validez.replace(" días", ""));

  const fechaFinal = new Date(`${fecha}T00:00:00`);

  fechaFinal.setDate(fechaFinal.getDate() + dias);

  const año = fechaFinal.getFullYear();

  const mes = String(fechaFinal.getMonth() + 1).padStart(2, "0");

  const dia = String(fechaFinal.getDate()).padStart(2, "0");

  return `${año}-${mes}-${dia}`;
}

function calcularValidez(fecha: string, validoHasta: string | null) {
  if (!validoHasta) {
    return "-";
  }

  const inicio = new Date(`${fecha.substring(0, 10)}T00:00:00`);

  const final = new Date(`${validoHasta.substring(0, 10)}T00:00:00`);

  const diferencia = final.getTime() - inicio.getTime();

  const dias = Math.round(diferencia / (1000 * 60 * 60 * 24));

  return `${dias} días`;
}

function formatearFecha(fecha: string) {
  const limpia = fecha.substring(0, 10);

  const [año, mes, dia] = limpia.split("-");

  return `${dia}/${mes}/${año}`;
}

function convertirFechaApi(fecha: string) {
  const [dia, mes, año] = fecha.split("/");

  return `${año}-${mes}-${dia}`;
}

function generarNumeroPresupuesto() {
  const ahora = new Date();

  const año = ahora.getFullYear();

  const marca = ahora.getTime().toString().slice(-6);

  return `PRE-${año}-${marca}`;
}
