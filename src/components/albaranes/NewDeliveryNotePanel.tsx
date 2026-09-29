"use client";

import { FormEvent, useState } from "react";

export type LineaAlbaran = {
  id: number;
  producto: string;
  referencia: string;
  cantidad: number;
};

export type EstadoAlbaran =
  | "Pendiente"
  | "Preparado"
  | "Entregado";

export type Albaran = {
  id: number;
  numero: string;
  pedido: string;
  cliente: string;
  fecha: string;
  estado: EstadoAlbaran;
  lineas: LineaAlbaran[];
  observaciones: string;
};

export type NuevoAlbaran = Omit<
  Albaran,
  "id" | "numero" | "fecha"
>;

type Props = {
  cerrar: () => void;
  guardar: (albaran: NuevoAlbaran) => void;
};

const pedidosDemo = [
  {
    numero: "PED-2026-001",
    cliente: "Muebles García",
  },
  {
    numero: "PED-2026-002",
    cliente: "Sofás Martínez",
  },
  {
    numero: "PED-2026-003",
    cliente: "Descanso Levante",
  },
];

const productosDemo = [
  {
    referencia: "COL-001",
    nombre: "Colchón Premium Visco",
  },
  {
    referencia: "ALM-001",
    nombre: "Almohada Viscoelástica",
  },
  {
    referencia: "CAN-001",
    nombre: "Canapé Abatible",
  },
  {
    referencia: "CAB-001",
    nombre: "Cabecero Tapizado",
  },
];

export default function NewDeliveryNotePanel({
  cerrar,
  guardar,
}: Props) {
  const [pedido, setPedido] = useState("");
  const [cliente, setCliente] = useState("");

  const [estado, setEstado] =
    useState<EstadoAlbaran>("Pendiente");

  const [lineas, setLineas] =
    useState<LineaAlbaran[]>([]);

  const [observaciones, setObservaciones] =
    useState("");

  const [error, setError] = useState("");

  /* ==========================================================
     SELECCIONAR PEDIDO
  ========================================================== */

  function seleccionarPedido(
    numeroPedido: string
  ) {
    setPedido(numeroPedido);

    const pedidoEncontrado =
      pedidosDemo.find(
        (pedido) =>
          pedido.numero === numeroPedido
      );

    setCliente(
      pedidoEncontrado?.cliente ?? ""
    );
  }

  /* ==========================================================
     AÑADIR PRODUCTO
  ========================================================== */

  function añadirProducto() {
    const producto = productosDemo[0];

    const nuevaLinea: LineaAlbaran = {
      id: Date.now(),
      producto: producto.nombre,
      referencia: producto.referencia,
      cantidad: 1,
    };

    setLineas((actuales) => [
      ...actuales,
      nuevaLinea,
    ]);
  }

  /* ==========================================================
     CAMBIAR PRODUCTO
  ========================================================== */

  function cambiarProducto(
    id: number,
    referencia: string
  ) {
    const producto =
      productosDemo.find(
        (producto) =>
          producto.referencia === referencia
      );

    if (!producto) return;

    setLineas((actuales) =>
      actuales.map((linea) =>
        linea.id === id
          ? {
              ...linea,
              producto: producto.nombre,
              referencia: producto.referencia,
            }
          : linea
      )
    );
  }

  /* ==========================================================
     CAMBIAR CANTIDAD
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
     ELIMINAR PRODUCTO
  ========================================================== */

  function eliminarLinea(id: number) {
    setLineas((actuales) =>
      actuales.filter(
        (linea) => linea.id !== id
      )
    );
  }

  /* ==========================================================
     GUARDAR
  ========================================================== */

  function enviarFormulario(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    if (!pedido) {
      setError(
        "Debes seleccionar un pedido."
      );
      return;
    }

    if (lineas.length === 0) {
      setError(
        "El albarán debe contener al menos un producto."
      );
      return;
    }

    guardar({
      pedido,
      cliente,
      estado,
      lineas,
      observaciones,
    });

    cerrar();
  }

  return (
    <>
      {/* FONDO */}

      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
        onClick={cerrar}
      />

      {/* PANEL */}

      <aside className="fixed right-0 top-0 z-50 flex h-screen w-full max-w-2xl flex-col bg-[#E8ECEC] shadow-2xl">

        {/* CABECERA */}

        <div className="flex items-center justify-between border-b border-slate-300 px-6 py-5">

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0F766E]">
              Ventas
            </p>

            <h2 className="mt-1 text-xl font-bold text-[#1C2526]">
              Nuevo albarán
            </h2>
          </div>

          <button
            type="button"
            onClick={cerrar}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-[#F5F7F7] text-lg text-slate-500"
          >
            ×
          </button>

        </div>

        {/* FORMULARIO */}

        <form
          onSubmit={enviarFormulario}
          noValidate
          className="flex min-h-0 flex-1 flex-col"
        >

          <div className="flex-1 overflow-y-auto p-6">

            {/* ERROR */}

            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            {/* INFORMACIÓN */}

            <div className="grid grid-cols-2 gap-4">

              <div>

                <label className="mb-2 block text-xs font-semibold text-slate-600">
                  Pedido *
                </label>

                <select
                  value={pedido}
                  onChange={(event) =>
                    seleccionarPedido(
                      event.target.value
                    )
                  }
                  className="h-11 w-full rounded-xl border border-slate-300 bg-[#F5F7F7] px-3 text-sm text-slate-700 outline-none focus:border-[#0F766E]"
                >

                  <option value="">
                    Seleccionar pedido
                  </option>

                  {pedidosDemo.map(
                    (pedido) => (
                      <option
                        key={pedido.numero}
                        value={pedido.numero}
                      >
                        {pedido.numero} -{" "}
                        {pedido.cliente}
                      </option>
                    )
                  )}

                </select>

              </div>

              <div>

                <label className="mb-2 block text-xs font-semibold text-slate-600">
                  Cliente
                </label>

                <div className="flex h-11 items-center rounded-xl border border-slate-300 bg-slate-100 px-3 text-sm font-semibold text-slate-600">
                  {cliente ||
                    "Selecciona un pedido"}
                </div>

              </div>

              <div>

                <label className="mb-2 block text-xs font-semibold text-slate-600">
                  Estado inicial
                </label>

                <select
                  value={estado}
                  onChange={(event) =>
                    setEstado(
                      event.target
                        .value as EstadoAlbaran
                    )
                  }
                  className="h-11 w-full rounded-xl border border-slate-300 bg-[#F5F7F7] px-3 text-sm text-slate-700 outline-none focus:border-[#0F766E]"
                >

                  <option value="Pendiente">
                    Pendiente
                  </option>

                  <option value="Preparado">
                    Preparado
                  </option>

                  <option value="Entregado">
                    Entregado
                  </option>

                </select>

              </div>

            </div>

            {/* PRODUCTOS */}

            <div className="mt-7">

              <div className="mb-4 flex items-center justify-between">

                <div>

                  <p className="text-sm font-bold text-[#1C2526]">
                    Productos entregados
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Indica los productos incluidos en este albarán.
                  </p>

                </div>

                <button
                  type="button"
                  onClick={añadirProducto}
                  className="rounded-lg bg-[#BFEDE7] px-3 py-2 text-xs font-bold text-[#0F766E] transition hover:bg-[#A8E4DC]"
                >
                  + Añadir producto
                </button>

              </div>

              <div className="space-y-3">

                {lineas.length === 0 && (

                  <div className="rounded-xl border border-dashed border-slate-300 bg-[#F5F7F7] p-6 text-center">

                    <p className="text-sm font-semibold text-slate-500">
                      Todavía no hay productos.
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Añade los artículos que se entregarán al cliente.
                    </p>

                  </div>

                )}

                {lineas.map((linea) => (

                  <div
                    key={linea.id}
                    className="rounded-xl border border-slate-300 bg-[#F5F7F7] p-4"
                  >

                    <div className="grid grid-cols-[1fr_100px_40px] items-end gap-3">

                      <div>

                        <label className="mb-1 block text-[11px] font-semibold text-slate-500">
                          Producto
                        </label>

                        <select
                          value={
                            linea.referencia
                          }
                          onChange={(event) =>
                            cambiarProducto(
                              linea.id,
                              event.target.value
                            )
                          }
                          className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700"
                        >

                          {productosDemo.map(
                            (producto) => (

                              <option
                                key={
                                  producto.referencia
                                }
                                value={
                                  producto.referencia
                                }
                              >
                                {producto.nombre}
                              </option>

                            )
                          )}

                        </select>

                      </div>

                      <div>

                        <label className="mb-1 block text-[11px] font-semibold text-slate-500">
                          Cantidad
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
                          className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700"
                        />

                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          eliminarLinea(
                            linea.id
                          )
                        }
                        className="flex h-10 w-10 items-center justify-center rounded-lg text-lg text-red-500 transition hover:bg-red-50"
                      >
                        ×
                      </button>

                    </div>

                  </div>

                ))}

              </div>

            </div>

            {/* OBSERVACIONES */}

            <div className="mt-7">

              <label className="mb-2 block text-xs font-semibold text-slate-600">
                Observaciones
              </label>

              <textarea
                value={observaciones}
                onChange={(event) =>
                  setObservaciones(
                    event.target.value
                  )
                }
                placeholder="Observaciones sobre la entrega..."
                rows={4}
                className="w-full resize-none rounded-xl border border-slate-300 bg-[#F5F7F7] p-3 text-sm text-slate-700 outline-none focus:border-[#0F766E]"
              />

            </div>

          </div>

          {/* PIE */}

          <div className="flex justify-end gap-3 border-t border-slate-300 bg-[#DDE2E2] px-6 py-4">

            <button
              type="button"
              onClick={cerrar}
              className="rounded-xl border border-slate-300 bg-[#F5F7F7] px-4 py-2.5 text-sm font-semibold text-slate-600"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="rounded-xl bg-[#0F766E] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#115E59]"
            >
              Crear albarán
            </button>

          </div>

        </form>

      </aside>
    </>
  );
}