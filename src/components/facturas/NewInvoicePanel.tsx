"use client";

import { FormEvent, useState } from "react";

export type LineaFactura = {
  id: number;
  concepto: string;
  referencia: string;
  cantidad: number;
  precio: number;
};

export type EstadoFactura =
  | "Pendiente"
  | "Pagada"
  | "Vencida"
  | "Anulada";

export type Factura = {
  id: number;
  numero: string;
  cliente: string;
  fecha: string;
  vencimiento: string;
  estado: EstadoFactura;
  origen: string;
  lineas: LineaFactura[];
  subtotal: number;
  iva: number;
  total: number;
};

export type NuevaFactura = Omit<
  Factura,
  "id" | "numero" | "fecha" | "subtotal" | "iva" | "total"
>;

type Props = {
  cerrar: () => void;
  guardar: (factura: NuevaFactura) => void;
};

const clientesDemo = [
  "Muebles García",
  "Sofás Martínez",
  "Descanso Levante",
  "Maderas del Sureste",
];

const productosDemo = [
  {
    referencia: "COL-001",
    nombre: "Colchón Premium Visco",
    precio: 499,
  },
  {
    referencia: "ALM-001",
    nombre: "Almohada Viscoelástica",
    precio: 59.9,
  },
  {
    referencia: "CAN-001",
    nombre: "Canapé Abatible",
    precio: 349,
  },
  {
    referencia: "CAB-001",
    nombre: "Cabecero Tapizado",
    precio: 189,
  },
];

export default function NewInvoicePanel({
  cerrar,
  guardar,
}: Props) {
  const [cliente, setCliente] = useState("");

  const [vencimiento, setVencimiento] =
    useState("30 días");

  const [estado, setEstado] =
    useState<EstadoFactura>("Pendiente");

  const [lineas, setLineas] =
    useState<LineaFactura[]>([]);

  const [error, setError] = useState("");

  /* ==========================================================
     AÑADIR PRODUCTO
  ========================================================== */

  function añadirProducto() {
    const producto = productosDemo[0];

    const nuevaLinea: LineaFactura = {
      id: Date.now(),
      concepto: producto.nombre,
      referencia: producto.referencia,
      cantidad: 1,
      precio: producto.precio,
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
    const producto = productosDemo.find(
      (producto) =>
        producto.referencia === referencia
    );

    if (!producto) return;

    setLineas((actuales) =>
      actuales.map((linea) =>
        linea.id === id
          ? {
              ...linea,
              concepto: producto.nombre,
              referencia: producto.referencia,
              precio: producto.precio,
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
              cantidad: cantidad < 1 ? 1 : cantidad,
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
      total + linea.precio * linea.cantidad,
    0
  );

  const iva = subtotal * 0.21;

  const total = subtotal + iva;

  /* ==========================================================
     GUARDAR
  ========================================================== */

  function enviarFormulario(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    if (!cliente) {
      setError(
        "Debes seleccionar un cliente."
      );
      return;
    }

    if (lineas.length === 0) {
      setError(
        "La factura debe contener al menos un producto."
      );
      return;
    }

    guardar({
      cliente,
      vencimiento,
      estado,
      origen: "Factura manual",
      lineas,
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
              Facturación
            </p>

            <h2 className="mt-1 text-xl font-bold text-[#1C2526]">
              Nueva factura
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
                  value={cliente}
                  onChange={(event) =>
                    setCliente(event.target.value)
                  }
                  className="h-11 w-full rounded-xl border border-slate-300 bg-[#F5F7F7] px-3 text-sm text-slate-700 outline-none focus:border-[#0F766E]"
                >
                  <option value="">
                    Seleccionar cliente
                  </option>

                  {clientesDemo.map(
                    (cliente) => (
                      <option
                        key={cliente}
                        value={cliente}
                      >
                        {cliente}
                      </option>
                    )
                  )}
                </select>

              </div>

              <div>

                <label className="mb-2 block text-xs font-semibold text-slate-600">
                  Vencimiento
                </label>

                <select
                  value={vencimiento}
                  onChange={(event) =>
                    setVencimiento(
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
                      event.target.value as EstadoFactura
                    )
                  }
                  className="h-11 w-full rounded-xl border border-slate-300 bg-[#F5F7F7] px-3 text-sm text-slate-700 outline-none focus:border-[#0F766E]"
                >
                  <option value="Pendiente">
                    Pendiente
                  </option>

                  <option value="Pagada">
                    Pagada
                  </option>
                </select>

              </div>

            </div>

            {/* PRODUCTOS */}

            <div className="mt-7">

              <div className="mb-4 flex items-center justify-between">

                <div>
                  <p className="text-sm font-bold text-[#1C2526]">
                    Conceptos de factura
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Añade los productos incluidos en la factura.
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
                      Todavía no hay conceptos.
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Añade al menos un producto para crear la factura.
                    </p>

                  </div>
                )}

                {lineas.map((linea) => (

                  <div
                    key={linea.id}
                    className="rounded-xl border border-slate-300 bg-[#F5F7F7] p-4"
                  >

                    <div className="grid grid-cols-[1fr_80px_110px_35px] items-end gap-3">

                      <div>

                        <label className="mb-1 block text-[11px] font-semibold text-slate-500">
                          Producto
                        </label>

                        <select
                          value={linea.referencia}
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
                                key={producto.referencia}
                                value={producto.referencia}
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
                          {formatearDinero(
                            linea.precio *
                              linea.cantidad
                          )}
                        </div>

                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          eliminarLinea(linea.id)
                        }
                        className="flex h-10 w-9 items-center justify-center rounded-lg text-lg text-red-500 transition hover:bg-red-50"
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
                titulo="Base imponible"
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
                  {formatearDinero(total)}
                </span>

              </div>

            </div>

          </div>

          {/* BOTONES */}

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
              Crear factura
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
        {formatearDinero(valor)}
      </span>

    </div>
  );
}

function formatearDinero(cantidad: number) {
  return `${cantidad.toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} €`;
}