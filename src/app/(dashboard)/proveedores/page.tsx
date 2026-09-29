"use client";

import { useEffect, useState } from "react";

import NewSupplierPanel, {
  NuevoProveedor,
  Proveedor,
} from "@/components/proveedores/NewSupplierPanel";

import SupplierDetailPanel from "@/components/proveedores/SupplierDetailPanel";

type ProveedorApi = {
  id: number;
  empresa_id: number;
  nombre: string;
  nif: string | null;
  telefono: string | null;
  email: string | null;
  contacto: string | null;
  direccion: string | null;
  codigo_postal: string | null;
  poblacion: string | null;
  activo: boolean;
};

function adaptarProveedor(proveedor: ProveedorApi): Proveedor {
  return {
    id: proveedor.id,
    nombre: proveedor.nombre,
    nif: proveedor.nif ?? "",
    telefono: proveedor.telefono ?? "",
    email: proveedor.email ?? "",
    contacto: proveedor.contacto ?? "",
    direccion: proveedor.direccion ?? "",
    codigoPostal: proveedor.codigo_postal ?? "",
    poblacion: proveedor.poblacion ?? "",
    estado: proveedor.activo ? "Activo" : "Inactivo",
  };
}

function prepararProveedor(proveedor: NuevoProveedor) {
  return {
    nombre: proveedor.nombre,
    nif: proveedor.nif || null,
    telefono: proveedor.telefono || null,
    email: proveedor.email || null,
    contacto: proveedor.contacto || null,
    direccion: proveedor.direccion || null,
    codigo_postal: proveedor.codigoPostal || null,
    poblacion: proveedor.poblacion || null,
    activo: proveedor.estado === "Activo",
  };
}

export default function ProveedoresPage() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);

  const [cargando, setCargando] = useState(true);

  const [busqueda, setBusqueda] = useState("");

  const [filtroEstado, setFiltroEstado] = useState("Todos");

  const [panelAbierto, setPanelAbierto] = useState(false);

  const [proveedorEditar, setProveedorEditar] = useState<Proveedor | null>(
    null,
  );

  const [proveedorSeleccionado, setProveedorSeleccionado] =
    useState<Proveedor | null>(null);

  /* ==========================================================
     CARGAR PROVEEDORES
  ========================================================== */

  useEffect(() => {
    async function cargarProveedores() {
      try {
        const respuesta = await fetch("http://127.0.0.1:8000/api/proveedores");

        if (!respuesta.ok) {
          throw new Error("No se han podido cargar los proveedores.");
        }

        const datos: ProveedorApi[] = await respuesta.json();

        setProveedores(datos.map(adaptarProveedor));
      } catch (error) {
        console.error("Error cargando proveedores:", error);
      } finally {
        setCargando(false);
      }
    }

    cargarProveedores();
  }, []);

  /* ==========================================================
     FILTRAR
  ========================================================== */

  const proveedoresFiltrados = proveedores.filter((proveedor) => {
    const texto = busqueda.toLowerCase();

    const coincideBusqueda =
      (proveedor.nombre ?? "").toLowerCase().includes(texto) ||
      (proveedor.nif ?? "").toLowerCase().includes(texto) ||
      (proveedor.email ?? "").toLowerCase().includes(texto) ||
      (proveedor.contacto ?? "").toLowerCase().includes(texto);

    const coincideEstado =
      filtroEstado === "Todos" || proveedor.estado === filtroEstado;

    return coincideBusqueda && coincideEstado;
  });

  /* ==========================================================
     CREAR
  ========================================================== */

  function abrirNuevoProveedor() {
    setProveedorEditar(null);
    setPanelAbierto(true);
  }

  async function guardarProveedor(
    nuevoProveedor: NuevoProveedor,
  ): Promise<boolean> {
    try {
      const respuesta = await fetch("http://127.0.0.1:8000/api/proveedores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          empresa_id: 1,
          ...prepararProveedor(nuevoProveedor),
        }),
      });

      if (!respuesta.ok) {
        const error = await respuesta.json();

        console.error("Error de Laravel al crear proveedor:", error);

        return false;
      }

      const proveedorCreado: ProveedorApi = await respuesta.json();

      const proveedorAdaptado = adaptarProveedor(proveedorCreado);

      setProveedores((actuales) =>
        [proveedorAdaptado, ...actuales].sort((a, b) =>
          a.nombre.localeCompare(b.nombre),
        ),
      );

      return true;
    } catch (error) {
      console.error("Error conectando con Laravel:", error);

      return false;
    }
  }

  /* ==========================================================
     EDITAR
  ========================================================== */

  function editarProveedor(proveedor: Proveedor) {
    setProveedorEditar(proveedor);
    setPanelAbierto(true);
  }

  async function actualizarProveedor(
    proveedorActualizado: Proveedor,
  ): Promise<boolean> {
    try {
      const { id, ...datosProveedor } = proveedorActualizado;

      const respuesta = await fetch(
        `http://127.0.0.1:8000/api/proveedores/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(prepararProveedor(datosProveedor)),
        },
      );

      if (!respuesta.ok) {
        const error = await respuesta.json();

        console.error("Error de Laravel al actualizar proveedor:", error);

        return false;
      }

      const proveedorGuardado: ProveedorApi = await respuesta.json();

      const proveedorAdaptado = adaptarProveedor(proveedorGuardado);

      setProveedores((actuales) =>
        actuales
          .map((proveedor) =>
            proveedor.id === id ? proveedorAdaptado : proveedor,
          )
          .sort((a, b) => a.nombre.localeCompare(b.nombre)),
      );

      setProveedorSeleccionado((actual) =>
        actual?.id === id ? proveedorAdaptado : actual,
      );

      return true;
    } catch (error) {
      console.error("Error conectando con Laravel:", error);

      return false;
    }
  }

  /* ==========================================================
     ELIMINAR
  ========================================================== */

  async function eliminarProveedor(id: number) {
    const confirmado = window.confirm(
      "¿Seguro que quieres eliminar este proveedor?",
    );

    if (!confirmado) return;

    try {
      const respuesta = await fetch(
        `http://127.0.0.1:8000/api/proveedores/${id}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
          },
        },
      );

      if (!respuesta.ok) {
        const error = await respuesta.json();

        console.error("Error de Laravel al eliminar proveedor:", error);

        window.alert("No se ha podido eliminar el proveedor.");

        return;
      }

      setProveedores((actuales) =>
        actuales.filter((proveedor) => proveedor.id !== id),
      );

      if (proveedorSeleccionado?.id === id) {
        setProveedorSeleccionado(null);
      }
    } catch (error) {
      console.error("Error conectando con Laravel:", error);

      window.alert("No se ha podido conectar con el servidor.");
    }
  }

  return (
    <>
      {/* CABECERA */}

      <section className="flex items-end justify-between">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.14em] text-[#5EEAD4]">
            Contactos
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-white">
            Proveedores
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Gestiona tus proveedores y contactos comerciales.
          </p>
        </div>

        <button
          onClick={abrirNuevoProveedor}
          className="rounded-xl bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#115E59]"
        >
          + Nuevo proveedor
        </button>
      </section>

      {/* TABLA */}

      <section className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[#E8ECEC] shadow-xl shadow-black/10">
        {/* BUSCADOR Y FILTRO */}

        <div className="flex items-center justify-between gap-4 border-b border-slate-300 p-5">
          <div className="relative w-full max-w-sm">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              ⌕
            </span>

            <input
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
              placeholder="Buscar proveedor, CIF, contacto..."
              className="h-10 w-full rounded-xl border border-slate-300 bg-[#F5F7F7] pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-[#0F766E]"
            />
          </div>

          <select
            value={filtroEstado}
            onChange={(event) => setFiltroEstado(event.target.value)}
            className="rounded-xl border border-slate-300 bg-[#F5F7F7] px-4 py-2.5 text-sm font-medium text-slate-600 outline-none focus:border-[#0F766E]"
          >
            <option value="Todos">Todos los estados</option>

            <option value="Activo">Activos</option>

            <option value="Inactivo">Inactivos</option>
          </select>
        </div>

        {/* TABLA */}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-300 bg-[#DDE2E2] text-left">
                {[
                  "Proveedor",
                  "NIF / CIF",
                  "Contacto",
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
              {cargando && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-10 text-center text-sm text-slate-500"
                  >
                    Cargando proveedores...
                  </td>
                </tr>
              )}

              {!cargando && proveedoresFiltrados.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-10 text-center text-sm text-slate-500"
                  >
                    No hay proveedores.
                  </td>
                </tr>
              )}

              {!cargando &&
                proveedoresFiltrados.map((proveedor) => (
                  <tr
                    key={proveedor.id}
                    className="border-b border-slate-300/70 transition last:border-0 hover:bg-[#F5F7F7]"
                  >
                    {/* PROVEEDOR */}

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#BFEDE7] text-xs font-bold text-[#0F766E]">
                          {proveedor.nombre.charAt(0)}
                        </div>

                        <span className="text-sm font-semibold text-[#1C2526]">
                          {proveedor.nombre}
                        </span>
                      </div>
                    </td>

                    {/* NIF */}

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {proveedor.nif || "—"}
                    </td>

                    {/* CONTACTO */}

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {proveedor.contacto || "—"}
                    </td>

                    {/* TELÉFONO */}

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {proveedor.telefono || "—"}
                    </td>

                    {/* EMAIL */}

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {proveedor.email || "—"}
                    </td>

                    {/* ESTADO */}

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          proveedor.estado === "Activo"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {proveedor.estado}
                      </span>
                    </td>

                    {/* ACCIONES */}

                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => setProveedorSeleccionado(proveedor)}
                        className="rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-500 transition hover:bg-slate-200 hover:text-[#0F766E]"
                      >
                        Ver
                      </button>

                      <button
                        onClick={() => editarProveedor(proveedor)}
                        className="rounded-lg px-3 py-1.5 text-sm font-semibold text-[#0F766E] transition hover:bg-[#BFEDE7]"
                      >
                        Editar
                      </button>

                      <button
                        onClick={() => eliminarProveedor(proveedor.id)}
                        className="ml-1 rounded-lg px-3 py-1.5 text-sm font-semibold text-red-500 transition hover:bg-red-50"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* PIE */}

        <div className="flex items-center justify-between border-t border-slate-300 px-5 py-4">
          <p className="text-xs text-slate-500">
            Mostrando {proveedoresFiltrados.length} de {proveedores.length}{" "}
            proveedores
          </p>
        </div>
      </section>

      {/* VER */}

      <SupplierDetailPanel
        proveedor={proveedorSeleccionado}
        cerrar={() => setProveedorSeleccionado(null)}
        editar={(proveedor) => {
          setProveedorSeleccionado(null);
          editarProveedor(proveedor);
        }}
      />

      {/* CREAR / EDITAR */}

      {panelAbierto && (
        <NewSupplierPanel
          key={proveedorEditar?.id ?? "nuevo"}
          cerrar={() => {
            setPanelAbierto(false);
            setProveedorEditar(null);
          }}
          guardar={guardarProveedor}
          proveedorEditar={proveedorEditar}
          actualizar={actualizarProveedor}
        />
      )}
    </>
  );
}
