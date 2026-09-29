"use client";

import { FormEvent, useState } from "react";

export type MovimientoStock = {
  id: number;
  producto: string;
  referencia: string;
  tipo: "Entrada" | "Salida";
  cantidad: number;
  motivo: string;
  fecha: string;
};

export type NuevoMovimiento = Omit<MovimientoStock, "id" | "fecha">;

type Props = {
  cerrar: () => void;
  guardar: (movimiento: NuevoMovimiento) => void;
};

export default function StockMovementPanel({
  cerrar,
  guardar,
}: Props) {
  const [formulario, setFormulario] =
    useState<NuevoMovimiento>({
      producto: "",
      referencia: "",
      tipo: "Entrada",
      cantidad: 1,
      motivo: "",
    });

  const [error, setError] = useState("");

  function enviarFormulario(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!formulario.producto.trim()) {
      setError("El producto es obligatorio.");
      return;
    }

    if (!formulario.referencia.trim()) {
      setError("La referencia es obligatoria.");
      return;
    }

    if (formulario.cantidad <= 0) {
      setError("La cantidad debe ser mayor que 0.");
      return;
    }

    guardar(formulario);
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

      <aside className="fixed right-0 top-0 z-50 flex h-screen w-full max-w-md flex-col bg-[#E8ECEC] shadow-2xl">

        {/* CABECERA */}

        <div className="flex items-center justify-between border-b border-slate-300 px-6 py-5">

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0F766E]">
              Inventario
            </p>

            <h2 className="mt-1 text-xl font-bold text-[#1C2526]">
              Nuevo movimiento
            </h2>
          </div>

          <button
            type="button"
            onClick={cerrar}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-[#F5F7F7] text-lg text-slate-500 transition hover:bg-white"
          >
            ×
          </button>

        </div>

        {/* FORMULARIO */}

        <form
          onSubmit={enviarFormulario}
          className="flex min-h-0 flex-1 flex-col"
          noValidate
        >

          <div className="flex-1 space-y-5 overflow-y-auto p-6">

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            {/* PRODUCTO */}

            <Campo
              titulo="Producto *"
              valor={formulario.producto}
              placeholder="Ej. Colchón Premium Visco"
              cambiar={(valor) =>
                setFormulario((anterior) => ({
                  ...anterior,
                  producto: valor,
                }))
              }
            />

            {/* REFERENCIA */}

            <Campo
              titulo="Referencia *"
              valor={formulario.referencia}
              placeholder="Ej. COL-001"
              cambiar={(valor) =>
                setFormulario((anterior) => ({
                  ...anterior,
                  referencia: valor,
                }))
              }
            />

            {/* TIPO */}

            <div>

              <label className="mb-2 block text-xs font-semibold text-slate-600">
                Tipo de movimiento
              </label>

              <select
                value={formulario.tipo}
                onChange={(event) =>
                  setFormulario((anterior) => ({
                    ...anterior,
                    tipo: event.target.value as
                      | "Entrada"
                      | "Salida",
                  }))
                }
                className="h-11 w-full rounded-xl border border-slate-300 bg-[#F5F7F7] px-4 text-sm text-slate-700 outline-none focus:border-[#0F766E]"
              >
                <option value="Entrada">
                  Entrada de stock
                </option>

                <option value="Salida">
                  Salida de stock
                </option>
              </select>

            </div>

            {/* CANTIDAD */}

            <div>

              <label className="mb-2 block text-xs font-semibold text-slate-600">
                Cantidad
              </label>

              <input
                type="number"
                min="1"
                value={formulario.cantidad}
                onChange={(event) =>
                  setFormulario((anterior) => ({
                    ...anterior,
                    cantidad: Number(
                      event.target.value
                    ),
                  }))
                }
                className="h-11 w-full rounded-xl border border-slate-300 bg-[#F5F7F7] px-4 text-sm text-slate-800 outline-none focus:border-[#0F766E]"
              />

            </div>

            {/* MOTIVO */}

            <div>

              <label className="mb-2 block text-xs font-semibold text-slate-600">
                Motivo
              </label>

              <textarea
                value={formulario.motivo}
                onChange={(event) =>
                  setFormulario((anterior) => ({
                    ...anterior,
                    motivo: event.target.value,
                  }))
                }
                placeholder="Ej. Entrada de proveedor, venta, ajuste de inventario..."
                rows={4}
                className="w-full resize-none rounded-xl border border-slate-300 bg-[#F5F7F7] px-4 py-3 text-sm text-slate-800 outline-none focus:border-[#0F766E]"
              />

            </div>

          </div>

          {/* BOTONES */}

          <div className="flex justify-end gap-3 border-t border-slate-300 bg-[#DDE2E2] px-6 py-4">

            <button
              type="button"
              onClick={cerrar}
              className="rounded-xl border border-slate-300 bg-[#F5F7F7] px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-white"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="rounded-xl bg-[#0F766E] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#115E59]"
            >
              Guardar movimiento
            </button>

          </div>

        </form>

      </aside>
    </>
  );
}

function Campo({
  titulo,
  valor,
  placeholder,
  cambiar,
}: {
  titulo: string;
  valor: string;
  placeholder: string;
  cambiar: (valor: string) => void;
}) {
  return (
    <div>

      <label className="mb-2 block text-xs font-semibold text-slate-600">
        {titulo}
      </label>

      <input
        type="text"
        value={valor}
        placeholder={placeholder}
        onChange={(event) =>
          cambiar(event.target.value)
        }
        className="h-11 w-full rounded-xl border border-slate-300 bg-[#F5F7F7] px-4 text-sm text-slate-800 outline-none focus:border-[#0F766E]"
      />

    </div>
  );
}