"use client";

import { useEffect, useState } from "react";

import NewClientPanel, {
  Cliente,
  NuevoCliente,
} from "@/components/clientes/NewClientPanel";

import ClientDetailPanel from "@/components/clientes/ClientDetailPanel";

/* ==========================================================
   TIPO DE CLIENTE QUE DEVUELVE LARAVEL
========================================================== */

type ClienteApi = {
  id: number;
  empresa_id: number;
  nombre: string;
  nif: string | null;
  email: string | null;
  telefono: string | null;
  direccion: string | null;
  codigo_postal: string | null;
  localidad: string | null;
  provincia: string | null;
  pais: string | null;
  activo: boolean;
};

/* ==========================================================
   ADAPTAR CLIENTE DE LARAVEL AL FRONTEND
========================================================== */

function adaptarCliente(cliente: ClienteApi): Cliente {
  return {
    id: cliente.id,
    nombre: cliente.nombre,
    nif: cliente.nif ?? "",
    telefono: cliente.telefono ?? "",
    email: cliente.email ?? "",
    estado: cliente.activo ? "Activo" : "Inactivo",
    direccion: cliente.direccion ?? "",
    codigoPostal: cliente.codigo_postal ?? "",
    poblacion: cliente.localidad ?? "",
  };
}

/* ==========================================================
   PREPARAR CLIENTE PARA ENVIAR A LARAVEL
========================================================== */

function prepararCliente(cliente: NuevoCliente) {
  return {
    nombre: cliente.nombre,
    nif: cliente.nif,
    telefono: cliente.telefono || null,
    email: cliente.email || null,
    direccion: cliente.direccion || null,
    codigo_postal: cliente.codigoPostal || null,
    localidad: cliente.poblacion || null,
    provincia: "Murcia",
    pais: "España",
    activo: cliente.estado === "Activo",
  };
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [cargando, setCargando] = useState(true);

  const [busqueda, setBusqueda] = useState("");

  const [filtroEstado, setFiltroEstado] =
    useState("Todos");

  const [panelAbierto, setPanelAbierto] =
    useState(false);

  const [clienteEditar, setClienteEditar] =
    useState<Cliente | null>(null);

  const [clienteSeleccionado, setClienteSeleccionado] =
    useState<Cliente | null>(null);

  /* ==========================================================
     CARGAR CLIENTES DESDE LARAVEL
  ========================================================== */

  useEffect(() => {
    async function cargarClientes() {
      try {
        const respuesta = await fetch(
          "http://127.0.0.1:8000/api/clientes"
        );

        if (!respuesta.ok) {
          throw new Error(
            "No se pudieron cargar los clientes"
          );
        }

        const datos: ClienteApi[] =
          await respuesta.json();

        setClientes(
          datos.map(adaptarCliente)
        );
      } catch (error) {
        console.error(
          "Error cargando clientes:",
          error
        );
      } finally {
        setCargando(false);
      }
    }

    cargarClientes();
  }, []);

  /* ==========================================================
     FILTRAR CLIENTES
  ========================================================== */

  const clientesFiltrados = clientes.filter(
    (cliente) => {
      const texto = busqueda.toLowerCase();

      const coincideBusqueda =
        cliente.nombre
          .toLowerCase()
          .includes(texto) ||
        cliente.nif
          .toLowerCase()
          .includes(texto) ||
        cliente.email
          .toLowerCase()
          .includes(texto) ||
        cliente.telefono.includes(texto);

      const coincideEstado =
        filtroEstado === "Todos" ||
        cliente.estado === filtroEstado;

      return coincideBusqueda && coincideEstado;
    }
  );

  /* ==========================================================
     ABRIR NUEVO CLIENTE
  ========================================================== */

  function abrirNuevoCliente() {
    setClienteEditar(null);
    setPanelAbierto(true);
  }

  /* ==========================================================
     CREAR CLIENTE - POST
  ========================================================== */

  async function guardarCliente(
    nuevoCliente: NuevoCliente
  ): Promise<boolean> {
    try {
      const respuesta = await fetch(
        "http://127.0.0.1:8000/api/clientes",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },

          body: JSON.stringify({
            empresa_id: 1,
            ...prepararCliente(nuevoCliente),
          }),
        }
      );

      if (!respuesta.ok) {
        const error = await respuesta.json();

        console.error(
          "Error de Laravel al crear:",
          error
        );

        return false;
      }

      const clienteCreado: ClienteApi =
        await respuesta.json();

      setClientes((actuales) =>
        [
          adaptarCliente(clienteCreado),
          ...actuales,
        ].sort((a, b) =>
          a.nombre.localeCompare(b.nombre)
        )
      );

      return true;
    } catch (error) {
      console.error(
        "Error creando cliente:",
        error
      );

      return false;
    }
  }

  /* ==========================================================
     ABRIR EDICIÓN
  ========================================================== */

  function editarCliente(cliente: Cliente) {
    setClienteEditar(cliente);
    setPanelAbierto(true);
  }

  /* ==========================================================
     ACTUALIZAR CLIENTE - PATCH
  ========================================================== */

  async function actualizarCliente(
    clienteActualizado: Cliente
  ): Promise<boolean> {
    try {
      const {
        id,
        ...datosCliente
      } = clienteActualizado;

      const respuesta = await fetch(
        `http://127.0.0.1:8000/api/clientes/${id}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },

          body: JSON.stringify(
            prepararCliente(datosCliente)
          ),
        }
      );

      if (!respuesta.ok) {
        const error = await respuesta.json();

        console.error(
          "Error de Laravel al actualizar:",
          error
        );

        return false;
      }

      const clienteGuardado: ClienteApi =
        await respuesta.json();

      const clienteAdaptado =
        adaptarCliente(clienteGuardado);

      setClientes((actuales) =>
        actuales
          .map((cliente) =>
            cliente.id === id
              ? clienteAdaptado
              : cliente
          )
          .sort((a, b) =>
            a.nombre.localeCompare(b.nombre)
          )
      );

      setClienteSeleccionado((actual) =>
        actual?.id === id
          ? clienteAdaptado
          : actual
      );

      return true;
    } catch (error) {
      console.error(
        "Error actualizando cliente:",
        error
      );

      return false;
    }
  }

  /* ==========================================================
     ELIMINAR CLIENTE - DELETE
  ========================================================== */

  async function eliminarCliente(id: number) {
    const confirmado = window.confirm(
      "¿Seguro que quieres eliminar este cliente?"
    );

    if (!confirmado) return;

    try {
      const respuesta = await fetch(
        `http://127.0.0.1:8000/api/clientes/${id}`,
        {
          method: "DELETE",

          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!respuesta.ok) {
        const error = await respuesta.json();

        console.error(
          "Error de Laravel al eliminar:",
          error
        );

        window.alert(
          "No se ha podido eliminar el cliente."
        );

        return;
      }

      setClientes((actuales) =>
        actuales.filter(
          (cliente) => cliente.id !== id
        )
      );

      if (clienteSeleccionado?.id === id) {
        setClienteSeleccionado(null);
      }
    } catch (error) {
      console.error(
        "Error eliminando cliente:",
        error
      );

      window.alert(
        "No se ha podido conectar con el servidor."
      );
    }
  }

  return (
    <>
      {/* ======================================================
          CABECERA
      ====================================================== */}

      <section className="flex items-end justify-between">

        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.14em] text-[#5EEAD4]">
            Contactos
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-white">
            Clientes
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Gestiona la información y actividad de tus clientes.
          </p>
        </div>

        <button
          onClick={abrirNuevoCliente}
          className="rounded-xl bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#115E59]"
        >
          + Nuevo cliente
        </button>

      </section>

      {/* ======================================================
          TABLA DE CLIENTES
      ====================================================== */}

      <section className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[#E8ECEC] shadow-xl shadow-black/10">

        {/* BUSCADOR Y FILTROS */}

        <div className="flex items-center justify-between gap-4 border-b border-slate-300 p-5">

          {/* BUSCADOR */}

          <div className="relative w-full max-w-sm">

            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              ⌕
            </span>

            <input
              value={busqueda}
              onChange={(event) =>
                setBusqueda(event.target.value)
              }
              placeholder="Buscar por nombre, CIF, email..."
              className="h-10 w-full rounded-xl border border-slate-300 bg-[#F5F7F7] pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-[#0F766E]"
            />

          </div>

          {/* FILTRO ESTADO */}

          <div className="flex gap-3">

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

              <option value="Activo">
                Activos
              </option>

              <option value="Inactivo">
                Inactivos
              </option>
            </select>

            <button className="rounded-xl border border-slate-300 bg-[#F5F7F7] px-4 py-2.5 text-sm font-medium text-slate-600">
              Filtros
            </button>

          </div>

        </div>

        {/* TABLA */}

        <div className="overflow-x-auto">

          {cargando ? (
            <div className="p-8 text-center text-sm text-slate-500">
              Cargando clientes...
            </div>
          ) : (
            <table className="w-full">

              <thead>

                <tr className="border-b border-slate-300 bg-[#DDE2E2] text-left">

                  {[
                    "Cliente",
                    "NIF / CIF",
                    "Teléfono",
                    "Email",
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

                {clientesFiltrados.map(
                  (cliente) => (

                    <tr
                      key={cliente.id}
                      className="border-b border-slate-300/70 transition last:border-0 hover:bg-[#F5F7F7]"
                    >

                      {/* CLIENTE */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#BFEDE7] text-xs font-bold text-[#0F766E]">
                            {cliente.nombre.charAt(0)}
                          </div>

                          <span className="text-sm font-semibold text-[#1C2526]">
                            {cliente.nombre}
                          </span>

                        </div>

                      </td>

                      {/* NIF */}

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {cliente.nif || "—"}
                      </td>

                      {/* TELÉFONO */}

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {cliente.telefono || "—"}
                      </td>

                      {/* EMAIL */}

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {cliente.email || "—"}
                      </td>

                      {/* ESTADO */}

                      <td className="px-5 py-4">

                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            cliente.estado === "Activo"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {cliente.estado}
                        </span>

                      </td>

                      {/* ACCIONES */}

                      <td className="px-5 py-4 text-right">

                        <button
                          onClick={() =>
                            setClienteSeleccionado(
                              cliente
                            )
                          }
                          className="rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-500 transition hover:bg-slate-200 hover:text-[#0F766E]"
                        >
                          Ver
                        </button>

                        <button
                          onClick={() =>
                            editarCliente(cliente)
                          }
                          className="rounded-lg px-3 py-1.5 text-sm font-semibold text-[#0F766E] transition hover:bg-[#BFEDE7]"
                        >
                          Editar
                        </button>

                        <button
                          onClick={() =>
                            eliminarCliente(
                              cliente.id
                            )
                          }
                          className="ml-1 rounded-lg px-3 py-1.5 text-sm font-semibold text-red-500 transition hover:bg-red-50"
                        >
                          Eliminar
                        </button>

                      </td>

                    </tr>

                  )
                )}

                {clientesFiltrados.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-10 text-center text-sm text-slate-500"
                    >
                      No hay clientes para mostrar.
                    </td>
                  </tr>
                )}

              </tbody>

            </table>
          )}

        </div>

        {/* ====================================================
            PIE DE TABLA
        ==================================================== */}

        <div className="flex items-center justify-between border-t border-slate-300 px-5 py-4">

          <p className="text-xs text-slate-500">
            Mostrando {clientesFiltrados.length} de{" "}
            {clientes.length} clientes
          </p>

          <div className="flex gap-2">

            <button className="rounded-lg border border-slate-300 bg-[#F5F7F7] px-3 py-1.5 text-xs text-slate-500">
              Anterior
            </button>

            <button className="rounded-lg bg-[#0F766E] px-3 py-1.5 text-xs font-semibold text-white">
              1
            </button>

            <button className="rounded-lg border border-slate-300 bg-[#F5F7F7] px-3 py-1.5 text-xs text-slate-600">
              Siguiente
            </button>

          </div>

        </div>

      </section>

      {/* ======================================================
          VER CLIENTE
      ====================================================== */}

      <ClientDetailPanel
        cliente={clienteSeleccionado}
        cerrar={() =>
          setClienteSeleccionado(null)
        }
        editar={(cliente) => {
          setClienteSeleccionado(null);
          editarCliente(cliente);
        }}
      />

      {/* ======================================================
          CREAR / EDITAR CLIENTE
      ====================================================== */}

      {panelAbierto && (
        <NewClientPanel
          key={
            clienteEditar?.id ?? "nuevo"
          }
          cerrar={() => {
            setPanelAbierto(false);
            setClienteEditar(null);
          }}
          guardar={guardarCliente}
          clienteEditar={clienteEditar}
          actualizar={actualizarCliente}
        />
      )}

    </>
  );
}