"use client";

import type { Cliente } from "./NewClientPanel";

type Props = {
  cliente: Cliente | null;
  cerrar: () => void;
  editar: (cliente: Cliente) => void;
};

export default function ClientDetailPanel({
  cliente,
  cerrar,
  editar,
}: Props) {
  if (!cliente) return null;

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

        <div className="border-b border-slate-300 px-6 py-5">

          <div className="flex items-start justify-between">

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#BFEDE7] text-lg font-bold text-[#0F766E]">
                {cliente.nombre.charAt(0)}
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0F766E]">
                  Cliente
                </p>

                <h2 className="mt-1 text-xl font-bold text-[#1C2526]">
                  {cliente.nombre}
                </h2>
              </div>

            </div>

            <button
              onClick={cerrar}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-[#F5F7F7] text-lg text-slate-500 transition hover:bg-white"
            >
              ×
            </button>

          </div>

          <div className="mt-4">

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                cliente.estado === "Activo"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-300 text-slate-600"
              }`}
            >
              {cliente.estado}
            </span>

          </div>

        </div>

        {/* INFORMACIÓN */}

        <div className="flex-1 overflow-y-auto p-6">

          <p className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">
            Información
          </p>

          <div className="space-y-3">

            <Dato
              titulo="NIF / CIF"
              valor={cliente.nif}
            />

            <Dato
              titulo="Teléfono"
              valor={cliente.telefono || "No indicado"}
            />

            <Dato
              titulo="Email"
              valor={cliente.email || "No indicado"}
            />

            <Dato
              titulo="Dirección"
              valor={cliente.direccion || "No indicada"}
            />

            <div className="grid grid-cols-2 gap-3">

              <Dato
                titulo="Código postal"
                valor={cliente.codigoPostal || "—"}
              />

              <Dato
                titulo="Población"
                valor={cliente.poblacion || "—"}
              />

            </div>

          </div>

          {/* ACTIVIDAD */}

          <div className="mt-7">

            <p className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">
              Actividad comercial
            </p>

            <div className="rounded-xl border border-dashed border-slate-300 bg-[#F5F7F7] p-5 text-center">

              <p className="text-sm font-semibold text-slate-600">
                Sin actividad registrada
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Aquí aparecerán sus presupuestos, pedidos,
                albaranes y facturas.
              </p>

            </div>

          </div>

        </div>

        {/* BOTONES */}

        <div className="flex justify-end gap-3 border-t border-slate-300 bg-[#DDE2E2] px-6 py-4">

          <button
            onClick={cerrar}
            className="rounded-xl border border-slate-300 bg-[#F5F7F7] px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-white"
          >
            Cerrar
          </button>

          <button
            onClick={() => editar(cliente)}
            className="rounded-xl bg-[#0F766E] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#115E59]"
          >
            Editar cliente
          </button>

        </div>

      </aside>
    </>
  );
}

function Dato({
  titulo,
  valor,
}: {
  titulo: string;
  valor: string;
}) {
  return (
    <div className="rounded-xl border border-slate-300 bg-[#F5F7F7] p-4">

      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        {titulo}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-700">
        {valor}
      </p>

    </div>
  );
}