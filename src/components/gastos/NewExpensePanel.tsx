"use client";

import { FormEvent, useState } from "react";

export type CategoriaGasto =
  | "Compras"
  | "Transporte"
  | "Alquiler"
  | "Suministros"
  | "Servicios"
  | "Otros";

export type EstadoGasto =
  | "Pendiente"
  | "Pagado";

export type Gasto = {
  id: number;
  concepto: string;
  proveedor: string;
  categoria: CategoriaGasto;
  fecha: string;
  importe: number;
  estado: EstadoGasto;
  referencia: string;
  observaciones: string;
};

export type NuevoGasto = Omit<
  Gasto,
  "id" | "fecha"
>;

type Props = {
  cerrar: () => void;
  guardar: (gasto: NuevoGasto) => void;
};

const proveedoresDemo = [
  "Espumas Levante S.L.",
  "Textiles del Sureste",
  "Maderas Mediterráneo",
  "Herrajes Industrial S.L.",
  "Otro",
];

export default function NewExpensePanel({
  cerrar,
  guardar,
}: Props) {
  const [concepto, setConcepto] =
    useState("");

  const [proveedor, setProveedor] =
    useState("");

  const [categoria, setCategoria] =
    useState<CategoriaGasto>("Compras");

  const [importe, setImporte] =
    useState("");

  const [estado, setEstado] =
    useState<EstadoGasto>("Pendiente");

  const [referencia, setReferencia] =
    useState("");

  const [
    observaciones,
    setObservaciones,
  ] = useState("");

  const [error, setError] =
    useState("");

  function enviarFormulario(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    if (!concepto.trim()) {
      setError(
        "Debes indicar el concepto del gasto."
      );
      return;
    }

    if (!proveedor) {
      setError(
        "Debes seleccionar un proveedor."
      );
      return;
    }

    const importeNumero =
      Number(importe);

    if (
      !importeNumero ||
      importeNumero <= 0
    ) {
      setError(
        "Debes introducir un importe válido."
      );
      return;
    }

    guardar({
      concepto,
      proveedor,
      categoria,
      importe: importeNumero,
      estado,
      referencia,
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

      <aside className="fixed right-0 top-0 z-50 flex h-screen w-full max-w-xl flex-col bg-[#E8ECEC] shadow-2xl">

        {/* CABECERA */}

        <div className="flex items-center justify-between border-b border-slate-300 px-6 py-5">

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0F766E]">
              Gestión
            </p>

            <h2 className="mt-1 text-xl font-bold text-[#1C2526]">
              Nuevo gasto
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Registra un gasto de la empresa.
            </p>
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

            <div className="space-y-5">

              {/* CONCEPTO */}

              <Campo
                titulo="Concepto *"
                valor={concepto}
                cambiar={setConcepto}
                placeholder="Ej. Compra de espuma HR"
              />

              {/* PROVEEDOR */}

              <div>
                <label className="mb-2 block text-xs font-semibold text-slate-600">
                  Proveedor *
                </label>

                <select
                  value={proveedor}
                  onChange={(event) =>
                    setProveedor(
                      event.target.value
                    )
                  }
                  className="h-11 w-full rounded-xl border border-slate-300 bg-[#F5F7F7] px-3 text-sm text-slate-700 outline-none focus:border-[#0F766E]"
                >
                  <option value="">
                    Seleccionar proveedor
                  </option>

                  {proveedoresDemo.map(
                    (proveedor) => (
                      <option
                        key={proveedor}
                        value={proveedor}
                      >
                        {proveedor}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* CATEGORÍA + ESTADO */}

              <div className="grid grid-cols-2 gap-4">

                <div>
                  <label className="mb-2 block text-xs font-semibold text-slate-600">
                    Categoría
                  </label>

                  <select
                    value={categoria}
                    onChange={(event) =>
                      setCategoria(
                        event.target
                          .value as CategoriaGasto
                      )
                    }
                    className="h-11 w-full rounded-xl border border-slate-300 bg-[#F5F7F7] px-3 text-sm text-slate-700 outline-none focus:border-[#0F766E]"
                  >
                    <option value="Compras">
                      Compras
                    </option>

                    <option value="Transporte">
                      Transporte
                    </option>

                    <option value="Alquiler">
                      Alquiler
                    </option>

                    <option value="Suministros">
                      Suministros
                    </option>

                    <option value="Servicios">
                      Servicios
                    </option>

                    <option value="Otros">
                      Otros
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
                        event.target
                          .value as EstadoGasto
                      )
                    }
                    className="h-11 w-full rounded-xl border border-slate-300 bg-[#F5F7F7] px-3 text-sm text-slate-700 outline-none focus:border-[#0F766E]"
                  >
                    <option value="Pendiente">
                      Pendiente
                    </option>

                    <option value="Pagado">
                      Pagado
                    </option>
                  </select>
                </div>

              </div>

              {/* IMPORTE */}

              <div>
                <label className="mb-2 block text-xs font-semibold text-slate-600">
                  Importe *
                </label>

                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={importe}
                    onChange={(event) =>
                      setImporte(
                        event.target.value
                      )
                    }
                    placeholder="0,00"
                    className="h-11 w-full rounded-xl border border-slate-300 bg-[#F5F7F7] px-3 pr-10 text-sm text-slate-700 outline-none focus:border-[#0F766E]"
                  />

                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                    €
                  </span>
                </div>
              </div>

              {/* REFERENCIA */}

              <Campo
                titulo="Factura / Referencia"
                valor={referencia}
                cambiar={setReferencia}
                placeholder="Ej. PROV-2026-458"
              />

              {/* OBSERVACIONES */}

              <div>
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
                  rows={4}
                  placeholder="Información adicional..."
                  className="w-full resize-none rounded-xl border border-slate-300 bg-[#F5F7F7] p-3 text-sm text-slate-700 outline-none focus:border-[#0F766E]"
                />
              </div>

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
              Guardar gasto
            </button>

          </div>

        </form>

      </aside>
    </>
  );
}

/* ==========================================================
   CAMPO REUTILIZABLE
========================================================== */

function Campo({
  titulo,
  valor,
  cambiar,
  placeholder,
}: {
  titulo: string;
  valor: string;
  cambiar: (valor: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-slate-600">
        {titulo}
      </label>

      <input
        type="text"
        value={valor}
        onChange={(event) =>
          cambiar(event.target.value)
        }
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-slate-300 bg-[#F5F7F7] px-3 text-sm text-slate-700 outline-none focus:border-[#0F766E]"
      />
    </div>
  );
}