"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

/* ==========================================================
   TIPOS
========================================================== */

export type LineaPresupuesto = {
  id: number;
  productoId: number;
  producto: string;
  referencia: string;
  cantidad: number;
  precio: number;
};

export type Presupuesto = {
  id: number;
  numero: string;
  clienteId: number;
  cliente: string;
  clienteEmail: string;
  fecha: string;
  validez: string;
  estado:
    | "Pendiente"
    | "Aceptado"
    | "Rechazado";
  lineas: LineaPresupuesto[];
  subtotal: number;
  iva: number;
  total: number;
};

export type DatosPresupuesto = {
  clienteId: number;
  cliente: string;
  validez: string;
  estado:
    | "Pendiente"
    | "Aceptado"
    | "Rechazado";
  lineas: LineaPresupuesto[];
};

type Props = {
  cerrar: () => void;

  guardar: (
    presupuesto: DatosPresupuesto
  ) => Promise<boolean>;

  presupuestoEditar?: Presupuesto | null;
};

type ClienteApi = {
  id: number;
  nombre: string;
  activo: boolean;
};

type ProductoApi = {
  id: number;
  referencia: string;
  nombre: string;
  precio: string | number;
  activo: boolean;
};

/* ==========================================================
   COMPONENTE
========================================================== */

export default function NewBudgetPanel({
  cerrar,
  guardar,
  presupuestoEditar = null,
}: Props) {
  const editando =
    presupuestoEditar !== null;

  const [clientes, setClientes] =
    useState<ClienteApi[]>([]);

  const [productos, setProductos] =
    useState<ProductoApi[]>([]);

  const [clienteId, setClienteId] =
    useState<number | "">(
      presupuestoEditar?.clienteId ?? ""
    );

  const [validez, setValidez] =
    useState(
      presupuestoEditar?.validez ??
        "30 días"
    );

  const [estado, setEstado] =
    useState<
      "Pendiente" | "Aceptado" | "Rechazado"
    >(
      presupuestoEditar?.estado ??
        "Pendiente"
    );

  const [lineas, setLineas] =
    useState<LineaPresupuesto[]>(
      presupuestoEditar?.lineas.map(
        (linea) => ({ ...linea })
      ) ?? []
    );

  const [error, setError] =
    useState("");

  const [cargandoDatos, setCargandoDatos] =
    useState(true);

  const [guardando, setGuardando] =
    useState(false);

  /* ==========================================================
     CARGAR CLIENTES Y PRODUCTOS
  ========================================================== */

  useEffect(() => {
    async function cargarDatos() {
      try {
        setCargandoDatos(true);

        const [
          respuestaClientes,
          respuestaProductos,
        ] = await Promise.all([
          fetch(
            "http://127.0.0.1:8000/api/clientes"
          ),
          fetch(
            "http://127.0.0.1:8000/api/productos"
          ),
        ]);

        if (
          !respuestaClientes.ok ||
          !respuestaProductos.ok
        ) {
          throw new Error(
            "No se pudieron cargar los datos."
          );
        }

        const datosClientes: ClienteApi[] =
          await respuestaClientes.json();

        const datosProductos: ProductoApi[] =
          await respuestaProductos.json();

        setClientes(
          datosClientes.filter(
            (cliente) => cliente.activo
          )
        );

        setProductos(
          datosProductos.filter(
            (producto) => producto.activo
          )
        );
      } catch (error) {
        console.error(error);

        setError(
          "No se pudieron cargar los clientes o productos."
        );
      } finally {
        setCargandoDatos(false);
      }
    }

    cargarDatos();
  }, []);

  /* ==========================================================
     AÑADIR PRODUCTO
  ========================================================== */

  function añadirProducto() {
    if (productos.length === 0) {
      setError(
        "No hay productos activos disponibles."
      );
      return;
    }

    const producto = productos[0];

    setLineas((actuales) => [
      ...actuales,
      {
        id: Date.now(),
        productoId: producto.id,
        producto: producto.nombre,
        referencia: producto.referencia,
        cantidad: 1,
        precio: Number(producto.precio),
      },
    ]);

    setError("");
  }

  /* ==========================================================
     CAMBIAR PRODUCTO
  ========================================================== */

  function cambiarProducto(
    id: number,
    productoId: number
  ) {
    const producto = productos.find(
      (producto) =>
        producto.id === productoId
    );

    if (!producto) return;

    setLineas((actuales) =>
      actuales.map((linea) =>
        linea.id === id
          ? {
              ...linea,
              productoId: producto.id,
              producto: producto.nombre,
              referencia:
                producto.referencia,
              precio: Number(
                producto.precio
              ),
            }
          : linea
      )
    );
  }

  /* ==========================================================
     CANTIDAD
  ========================================================== */

  function cambiarCantidad(
    id: number,
    cantidad: number
  ) {
    setLineas((actuales) =>
      actuales.map((linea) =>
        linea.id === id
          ? {
              ...linea,
              cantidad:
                cantidad < 1 ? 1 : cantidad,
            }
          : linea
      )
    );
  }

  /* ==========================================================
     ELIMINAR LÍNEA
  ========================================================== */

  function eliminarLinea(id: number) {
    setLineas((actuales) =>
      actuales.filter(
        (linea) => linea.id !== id
      )
    );
  }

  /* ==========================================================
     TOTALES
  ========================================================== */

  const subtotal = lineas.reduce(
    (total, linea) =>
      total +
      linea.precio * linea.cantidad,
    0
  );

  const iva = subtotal * 0.21;
  const total = subtotal + iva;

  /* ==========================================================
     GUARDAR
  ========================================================== */

  async function enviarFormulario(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!clienteId) {
      setError(
        "Debes seleccionar un cliente."
      );
      return;
    }

    if (lineas.length === 0) {
      setError(
        "El presupuesto debe tener al menos un producto."
      );
      return;
    }

    const cliente =
      clientes.find(
        (cliente) =>
          cliente.id === clienteId
      );

    if (!cliente) {
      setError(
        "No se ha encontrado el cliente seleccionado."
      );
      return;
    }

    try {
      setGuardando(true);
      setError("");

      const correcto = await guardar({
        clienteId,
        cliente: cliente.nombre,
        validez,
        estado,
        lineas,
      });

      if (correcto) {
        cerrar();
      }
    } catch (error) {
      console.error(error);

      setError(
        "No se pudo guardar el presupuesto."
      );
    } finally {
      setGuardando(false);
    }
  }

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
        onClick={cerrar}
      />

      <aside className="fixed right-0 top-0 z-50 flex h-screen w-full max-w-2xl flex-col bg-[#E8ECEC] shadow-2xl">

        {/* CABECERA */}

        <div className="flex items-center justify-between border-b border-slate-300 px-6 py-5">

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0F766E]">
              Ventas
            </p>

            <h2 className="mt-1 text-xl font-bold text-[#1C2526]">
              {editando
                ? "Editar presupuesto"
                : "Nuevo presupuesto"}
            </h2>

            {editando && (
              <p className="mt-1 text-xs text-slate-500">
                {presupuestoEditar.numero}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={cerrar}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-[#F5F7F7] text-lg text-slate-500"
          >
            ×
          </button>

        </div>

        <form
          onSubmit={enviarFormulario}
          className="flex min-h-0 flex-1 flex-col"
        >

          <div className="flex-1 overflow-y-auto p-6">

            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            {/* DATOS GENERALES */}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

              <div>
                <label className="mb-2 block text-xs font-semibold text-slate-600">
                  Cliente *
                </label>

                <select
                  value={clienteId}
                  disabled={cargandoDatos}
                  onChange={(event) =>
                    setClienteId(
                      event.target.value
                        ? Number(
                            event.target.value
                          )
                        : ""
                    )
                  }
                  className="h-11 w-full rounded-xl border border-slate-300 bg-[#F5F7F7] px-3 text-sm text-slate-700 outline-none focus:border-[#0F766E]"
                >
                  <option value="">
                    Seleccionar cliente
                  </option>

                  {clientes.map(
                    (cliente) => (
                      <option
                        key={cliente.id}
                        value={cliente.id}
                      >
                        {cliente.nombre}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold text-slate-600">
                  Validez
                </label>

                <select
                  value={validez}
                  onChange={(event) =>
                    setValidez(
                      event.target.value
                    )
                  }
                  className="h-11 w-full rounded-xl border border-slate-300 bg-[#F5F7F7] px-3 text-sm text-slate-700 outline-none focus:border-[#0F766E]"
                >
                  <option value="15 días">
                    15 días
                  </option>

                  <option value="30 días">
                    30 días
                  </option>

                  <option value="60 días">
                    60 días
                  </option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold text-slate-600">
                  Estado
                </label>

                <select
                  value={estado}
                  onChange={(event) =>
                    setEstado(
                      event.target.value as
                        | "Pendiente"
                        | "Aceptado"
                        | "Rechazado"
                    )
                  }
                  className="h-11 w-full rounded-xl border border-slate-300 bg-[#F5F7F7] px-3 text-sm text-slate-700 outline-none focus:border-[#0F766E]"
                >
                  <option value="Pendiente">
                    Pendiente
                  </option>

                  <option value="Aceptado">
                    Aceptado
                  </option>

                  <option value="Rechazado">
                    Rechazado
                  </option>
                </select>
              </div>

            </div>

            {/* PRODUCTOS */}

            <div className="mt-7">

              <div className="mb-4 flex items-center justify-between">

                <div>
                  <p className="text-sm font-bold text-[#1C2526]">
                    Productos
                  </p>

                  <p className="text-xs text-slate-500">
                    Añade o modifica los productos del presupuesto.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={añadirProducto}
                  disabled={
                    cargandoDatos ||
                    productos.length === 0
                  }
                  className="rounded-lg bg-[#BFEDE7] px-3 py-2 text-xs font-bold text-[#0F766E] disabled:opacity-50"
                >
                  + Añadir producto
                </button>

              </div>

              <div className="space-y-3">

                {lineas.length === 0 && (
                  <div className="rounded-xl border border-dashed border-slate-300 bg-[#F5F7F7] p-6 text-center text-sm text-slate-500">
                    Todavía no hay productos.
                  </div>
                )}

                {lineas.map((linea) => (

                  <div
                    key={linea.id}
                    className="rounded-xl border border-slate-300 bg-[#F5F7F7] p-4"
                  >

                    <div className="grid grid-cols-[1fr_80px_100px_35px] items-end gap-3">

                      <div>
                        <label className="mb-1 block text-[11px] font-semibold text-slate-500">
                          Producto
                        </label>

                        <select
                          value={
                            linea.productoId
                          }
                          onChange={(event) =>
                            cambiarProducto(
                              linea.id,
                              Number(
                                event.target.value
                              )
                            )
                          }
                          className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700"
                        >
                          {productos.map(
                            (producto) => (
                              <option
                                key={producto.id}
                                value={producto.id}
                              >
                                {producto.nombre}
                              </option>
                            )
                          )}
                        </select>
                      </div>

                      <div>
                        <label className="mb-1 block text-[11px] font-semibold text-slate-500">
                          Cant.
                        </label>

                        <input
                          type="number"
                          min="1"
                          value={linea.cantidad}
                          onChange={(event) =>
                            cambiarCantidad(
                              linea.id,
                              Number(
                                event.target.value
                              )
                            )
                          }
                          className="h-10 w-full rounded-lg border border-slate-300 bg-white px-2 text-sm text-slate-700"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-[11px] font-semibold text-slate-500">
                          Importe
                        </label>

                        <div className="flex h-10 items-center rounded-lg border border-slate-300 bg-slate-100 px-3 text-sm font-semibold text-slate-700">
                          {(
                            linea.precio *
                            linea.cantidad
                          ).toLocaleString(
                            "es-ES",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}{" "}
                          €
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          eliminarLinea(
                            linea.id
                          )
                        }
                        className="flex h-10 w-9 items-center justify-center rounded-lg text-lg text-red-500 hover:bg-red-50"
                      >
                        ×
                      </button>

                    </div>

                  </div>
                ))}

              </div>
            </div>

            {/* TOTALES */}

            <div className="mt-6 ml-auto w-full max-w-xs rounded-xl border border-slate-300 bg-[#F5F7F7] p-4">

              <FilaTotal
                titulo="Subtotal"
                valor={subtotal}
              />

              <FilaTotal
                titulo="IVA (21%)"
                valor={iva}
              />

              <div className="my-3 border-t border-slate-300" />

              <div className="flex items-center justify-between">

                <span className="text-sm font-bold text-[#1C2526]">
                  Total
                </span>

                <span className="text-lg font-bold text-[#0F766E]">
                  {total.toLocaleString(
                    "es-ES",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}{" "}
                  €
                </span>

              </div>

            </div>

          </div>

          {/* PIE */}

          <div className="flex justify-end gap-3 border-t border-slate-300 bg-[#DDE2E2] px-6 py-4">

            <button
              type="button"
              onClick={cerrar}
              disabled={guardando}
              className="rounded-xl border border-slate-300 bg-[#F5F7F7] px-4 py-2.5 text-sm font-semibold text-slate-600"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={guardando}
              className="rounded-xl bg-[#0F766E] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#115E59] disabled:opacity-60"
            >
              {guardando
                ? "Guardando..."
                : editando
                ? "Guardar cambios"
                : "Guardar presupuesto"}
            </button>

          </div>

        </form>

      </aside>
    </>
  );
}

function FilaTotal({
  titulo,
  valor,
}: {
  titulo: string;
  valor: number;
}) {
  return (
    <div className="mb-2 flex justify-between text-sm">

      <span className="text-slate-500">
        {titulo}
      </span>

      <span className="font-semibold text-slate-700">
        {valor.toLocaleString("es-ES", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}{" "}
        €
      </span>

    </div>
  );
}