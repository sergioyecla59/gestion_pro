"use client";

import { FormEvent, useState } from "react";

export type Producto = {
  id: number;
  referencia: string;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
  stockMinimo: number;
  estado: string;
};

export type NuevoProducto = Omit<Producto, "id">;

type Props = {
  cerrar: () => void;

  guardar: (
    producto: NuevoProducto
  ) => Promise<boolean> | boolean;

  productoEditar?: Producto | null;

  actualizar?: (
    producto: Producto
  ) => Promise<boolean> | boolean;
};

const formularioVacio: NuevoProducto = {
  referencia: "",
  nombre: "",
  categoria: "",
  precio: 0,
  stock: 0,
  stockMinimo: 0,
  estado: "Activo",
};

export default function NewProductPanel({
  cerrar,
  guardar,
  productoEditar = null,
  actualizar,
}: Props) {
  const [formulario, setFormulario] =
    useState<NuevoProducto>(() => {
      if (productoEditar) {
        const { id, ...datos } = productoEditar;

        return datos;
      }

      return formularioVacio;
    });

  const [error, setError] = useState("");

  const [guardando, setGuardando] =
    useState(false);

  function cambiarTexto(
    campo:
      | "referencia"
      | "nombre"
      | "categoria"
      | "estado",
    valor: string
  ) {
    setFormulario((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));
  }

  function cambiarNumero(
    campo:
      | "precio"
      | "stock"
      | "stockMinimo",
    valor: string
  ) {
    setFormulario((anterior) => ({
      ...anterior,
      [campo]: Number(valor),
    }));
  }

  async function enviarFormulario(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    if (!formulario.referencia.trim()) {
      setError(
        "La referencia es obligatoria."
      );

      return;
    }

    if (!formulario.nombre.trim()) {
      setError(
        "El nombre del producto es obligatorio."
      );

      return;
    }

    if (formulario.precio < 0) {
      setError(
        "El precio no puede ser negativo."
      );

      return;
    }

    if (formulario.stock < 0) {
      setError(
        "El stock no puede ser negativo."
      );

      return;
    }

    if (formulario.stockMinimo < 0) {
      setError(
        "El stock mínimo no puede ser negativo."
      );

      return;
    }

    setGuardando(true);

    try {
      let correcto = false;

      if (
        productoEditar &&
        actualizar
      ) {
        correcto = await actualizar({
          id: productoEditar.id,
          ...formulario,
        });
      } else {
        correcto = await guardar(
          formulario
        );
      }

      if (!correcto) {
        setError(
          "No se ha podido guardar el producto."
        );

        return;
      }

      cerrar();
    } catch (error) {
      console.error(
        "Error guardando producto:",
        error
      );

      setError(
        "Ha ocurrido un error al guardar el producto."
      );
    } finally {
      setGuardando(false);
    }
  }

  const editando =
    productoEditar !== null;

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
              Catálogo
            </p>

            <h2 className="mt-1 text-xl font-bold text-[#1C2526]">
              {editando
                ? "Editar producto"
                : "Nuevo producto"}
            </h2>
          </div>

          <button
            type="button"
            onClick={cerrar}
            disabled={guardando}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-[#F5F7F7] text-lg text-slate-500 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
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

          <div className="flex-1 space-y-5 overflow-y-auto p-6">

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            {/* REFERENCIA */}

            <CampoTexto
              titulo="Referencia / SKU *"
              valor={formulario.referencia}
              placeholder="Ej. COL-001"
              cambiar={(valor) =>
                cambiarTexto(
                  "referencia",
                  valor
                )
              }
            />

            {/* NOMBRE */}

            <CampoTexto
              titulo="Nombre del producto *"
              valor={formulario.nombre}
              placeholder="Ej. Colchón Premium Visco"
              cambiar={(valor) =>
                cambiarTexto(
                  "nombre",
                  valor
                )
              }
            />

            {/* CATEGORÍA */}

            <CampoTexto
              titulo="Categoría"
              valor={formulario.categoria}
              placeholder="Ej. Colchones"
              cambiar={(valor) =>
                cambiarTexto(
                  "categoria",
                  valor
                )
              }
            />

            {/* PRECIO */}

            <CampoNumero
              titulo="Precio de venta (€)"
              valor={formulario.precio}
              step="0.01"
              cambiar={(valor) =>
                cambiarNumero(
                  "precio",
                  valor
                )
              }
            />

            {/* STOCK */}

            <div className="grid grid-cols-2 gap-4">

              <CampoNumero
                titulo="Stock actual"
                valor={formulario.stock}
                step="1"
                cambiar={(valor) =>
                  cambiarNumero(
                    "stock",
                    valor
                  )
                }
              />

              <CampoNumero
                titulo="Stock mínimo"
                valor={
                  formulario.stockMinimo
                }
                step="1"
                cambiar={(valor) =>
                  cambiarNumero(
                    "stockMinimo",
                    valor
                  )
                }
              />

            </div>

            {/* ESTADO */}

            <div>

              <label className="mb-2 block text-xs font-semibold text-slate-600">
                Estado
              </label>

              <select
                value={formulario.estado}
                onChange={(event) =>
                  cambiarTexto(
                    "estado",
                    event.target.value
                  )
                }
                className="h-11 w-full rounded-xl border border-slate-300 bg-[#F5F7F7] px-3 text-sm text-slate-700 outline-none focus:border-[#0F766E]"
              >
                <option value="Activo">
                  Activo
                </option>

                <option value="Inactivo">
                  Inactivo
                </option>
              </select>

            </div>

          </div>

          {/* BOTONES */}

          <div className="flex justify-end gap-3 border-t border-slate-300 bg-[#DDE2E2] px-6 py-4">

            <button
              type="button"
              onClick={cerrar}
              disabled={guardando}
              className="rounded-xl border border-slate-300 bg-[#F5F7F7] px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={guardando}
              className="rounded-xl bg-[#0F766E] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#115E59] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {guardando
                ? "Guardando..."
                : editando
                  ? "Guardar cambios"
                  : "Guardar producto"}
            </button>

          </div>

        </form>

      </aside>
    </>
  );
}

function CampoTexto({
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
        onChange={(event) =>
          cambiar(event.target.value)
        }
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-slate-300 bg-[#F5F7F7] px-4 text-sm text-slate-800 outline-none transition focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10"
      />

    </div>
  );
}

function CampoNumero({
  titulo,
  valor,
  step,
  cambiar,
}: {
  titulo: string;
  valor: number;
  step: string;
  cambiar: (valor: string) => void;
}) {
  return (
    <div>

      <label className="mb-2 block text-xs font-semibold text-slate-600">
        {titulo}
      </label>

      <input
        type="number"
        min="0"
        step={step}
        value={valor}
        onChange={(event) =>
          cambiar(event.target.value)
        }
        className="h-11 w-full rounded-xl border border-slate-300 bg-[#F5F7F7] px-4 text-sm text-slate-800 outline-none transition focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10"
      />

    </div>
  );
}