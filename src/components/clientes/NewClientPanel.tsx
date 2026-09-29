"use client";

import { FormEvent, useState } from "react";

export type Cliente = {
  id: number;
  nombre: string;
  nif: string;
  telefono: string;
  email: string;
  estado: string;
  direccion: string;
  codigoPostal: string;
  poblacion: string;
};

export type NuevoCliente = Omit<Cliente, "id">;

type Props = {
  cerrar: () => void;

  guardar: (
    cliente: NuevoCliente
  ) => Promise<boolean> | boolean;

  clienteEditar?: Cliente | null;

  actualizar?: (
    cliente: Cliente
  ) => Promise<boolean> | boolean;
};

const formularioVacio: NuevoCliente = {
  nombre: "",
  nif: "",
  telefono: "",
  email: "",
  estado: "Activo",
  direccion: "",
  codigoPostal: "",
  poblacion: "",
};

export default function NewClientPanel({
  cerrar,
  guardar,
  clienteEditar = null,
  actualizar,
}: Props) {
  const [formulario, setFormulario] =
    useState<NuevoCliente>(() => {
      if (clienteEditar) {
        const { id, ...datos } = clienteEditar;
        return datos;
      }

      return formularioVacio;
    });

  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  function cambiarCampo(
    campo: keyof NuevoCliente,
    valor: string
  ) {
    setFormulario((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));
  }

  async function enviarFormulario(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    if (!formulario.nombre.trim()) {
      setError("El nombre del cliente es obligatorio.");
      return;
    }

    if (!formulario.nif.trim()) {
      setError("El NIF / CIF es obligatorio.");
      return;
    }

    if (
      formulario.email &&
      !formulario.email.includes("@")
    ) {
      setError("Introduce un email válido.");
      return;
    }

    try {
      setGuardando(true);

      let correcto = false;

      if (clienteEditar && actualizar) {
        correcto = await actualizar({
          id: clienteEditar.id,
          ...formulario,
        });
      } else {
        correcto = await guardar(formulario);
      }

      if (correcto) {
        cerrar();
      } else {
        setError(
          "No se ha podido guardar el cliente."
        );
      }
    } catch (error) {
      console.error(error);

      setError(
        "Ha ocurrido un error al guardar el cliente."
      );
    } finally {
      setGuardando(false);
    }
  }

  const editando = clienteEditar !== null;

  return (
    <>
      {/* FONDO OSCURO */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
        onClick={cerrar}
      />

      {/* PANEL LATERAL */}
      <aside className="fixed right-0 top-0 z-50 flex h-screen w-full max-w-md flex-col bg-[#E8ECEC] shadow-2xl">

        {/* CABECERA */}
        <div className="flex items-center justify-between border-b border-slate-300 px-6 py-5">

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0F766E]">
              Clientes
            </p>

            <h2 className="mt-1 text-xl font-bold text-[#1C2526]">
              {editando
                ? "Editar cliente"
                : "Nuevo cliente"}
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
          noValidate
          className="flex min-h-0 flex-1 flex-col"
        >

          <div className="flex-1 space-y-5 overflow-y-auto p-6">

            {/* ERROR */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            <Campo
              titulo="Nombre / Razón social *"
              valor={formulario.nombre}
              placeholder="Ej. Muebles García S.L."
              cambiar={(valor) =>
                cambiarCampo("nombre", valor)
              }
            />

            <Campo
              titulo="NIF / CIF *"
              valor={formulario.nif}
              placeholder="B12345678"
              cambiar={(valor) =>
                cambiarCampo("nif", valor)
              }
            />

            {/* TELÉFONO + ESTADO */}
            <div className="grid grid-cols-2 gap-4">

              <Campo
                titulo="Teléfono"
                valor={formulario.telefono}
                placeholder="600 000 000"
                cambiar={(valor) =>
                  cambiarCampo("telefono", valor)
                }
              />

              <div>
                <label className="mb-2 block text-xs font-semibold text-slate-600">
                  Estado
                </label>

                <select
                  value={formulario.estado}
                  onChange={(event) =>
                    cambiarCampo(
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

            <Campo
              titulo="Email"
              valor={formulario.email}
              placeholder="cliente@empresa.es"
              cambiar={(valor) =>
                cambiarCampo("email", valor)
              }
            />

            <Campo
              titulo="Dirección"
              valor={formulario.direccion}
              placeholder="Calle, número..."
              cambiar={(valor) =>
                cambiarCampo("direccion", valor)
              }
            />

            {/* CP + POBLACIÓN */}
            <div className="grid grid-cols-2 gap-4">

              <Campo
                titulo="Código postal"
                valor={formulario.codigoPostal}
                placeholder="30510"
                cambiar={(valor) =>
                  cambiarCampo(
                    "codigoPostal",
                    valor
                  )
                }
              />

              <Campo
                titulo="Población"
                valor={formulario.poblacion}
                placeholder="Yecla"
                cambiar={(valor) =>
                  cambiarCampo(
                    "poblacion",
                    valor
                  )
                }
              />

            </div>

          </div>

          {/* BOTONES */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-300 bg-[#DDE2E2] px-6 py-4">

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
                  : "Guardar cliente"}
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
        onChange={(event) =>
          cambiar(event.target.value)
        }
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-slate-300 bg-[#F5F7F7] px-4 text-sm text-slate-800 outline-none transition focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10"
      />

    </div>
  );
}