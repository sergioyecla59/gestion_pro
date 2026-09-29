"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [
    menuCrearAbierto,
    setMenuCrearAbierto,
  ] = useState(false);

  const [
    menuPerfilAbierto,
    setMenuPerfilAbierto,
  ] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-[68px] items-center justify-between border-b border-slate-300 bg-[#E8ECEC] px-8">

      {/* ======================================================
          BUSCADOR
      ====================================================== */}

      <div className="relative w-full max-w-md">

        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
          ⌕
        </span>

        <input
          type="text"
          placeholder="Buscar clientes, pedidos, facturas..."
          className="h-10 w-full rounded-xl border border-slate-300 bg-[#F5F7F7] pl-11 pr-4 text-sm text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-500 focus:border-[#0F766E] focus:bg-white focus:ring-4 focus:ring-[#0F766E]/10"
        />

      </div>

      {/* ======================================================
          ACCIONES
      ====================================================== */}

      <div className="ml-8 flex items-center gap-3">

        {/* CREAR */}

        <div className="relative">

          <button
            type="button"
            onClick={() => {
              setMenuCrearAbierto(
                (actual) =>
                  !actual
              );

              setMenuPerfilAbierto(
                false
              );
            }}
            className="flex h-10 items-center gap-2 rounded-lg bg-[#0F766E] px-4 text-sm font-semibold text-white transition hover:bg-[#115E59]"
          >

            <span className="text-lg font-light">
              +
            </span>

            Crear

            <span
              className={`ml-1 text-[10px] opacity-70 transition ${
                menuCrearAbierto
                  ? "rotate-180"
                  : ""
              }`}
            >
              ▼
            </span>

          </button>

          {/* MENÚ CREAR */}

          {menuCrearAbierto && (

            <div className="absolute right-0 top-12 z-50 w-56 overflow-hidden rounded-xl border border-slate-300 bg-white p-2 shadow-xl">

              <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Crear nuevo
              </p>

              <OpcionCrear
                ruta="/presupuestos"
                icono="▤"
                titulo="Presupuesto"
                cerrar={() =>
                  setMenuCrearAbierto(
                    false
                  )
                }
              />

              <OpcionCrear
                ruta="/pedidos"
                icono="▣"
                titulo="Pedido"
                cerrar={() =>
                  setMenuCrearAbierto(
                    false
                  )
                }
              />

              <OpcionCrear
                ruta="/albaranes"
                icono="▧"
                titulo="Albarán"
                cerrar={() =>
                  setMenuCrearAbierto(
                    false
                  )
                }
              />

              <OpcionCrear
                ruta="/facturas"
                icono="▥"
                titulo="Factura"
                cerrar={() =>
                  setMenuCrearAbierto(
                    false
                  )
                }
              />

              <div className="my-2 border-t border-slate-200" />

              <OpcionCrear
                ruta="/clientes"
                icono="◎"
                titulo="Cliente"
                cerrar={() =>
                  setMenuCrearAbierto(
                    false
                  )
                }
              />

              <OpcionCrear
                ruta="/productos"
                icono="□"
                titulo="Producto"
                cerrar={() =>
                  setMenuCrearAbierto(
                    false
                  )
                }
              />

              <OpcionCrear
                ruta="/gastos"
                icono="€"
                titulo="Gasto"
                cerrar={() =>
                  setMenuCrearAbierto(
                    false
                  )
                }
              />

            </div>

          )}

        </div>

        {/* ====================================================
            NOTIFICACIONES
        ==================================================== */}

        <button
          type="button"
          aria-label="Notificaciones"
          title="Notificaciones disponibles más adelante"
          className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 bg-[#F5F7F7] text-slate-600 transition hover:bg-white hover:text-slate-900"
        >
          ♢

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-[#F5F7F7]" />

        </button>

        <div className="mx-1 h-8 w-px bg-slate-300" />

        {/* ====================================================
            PERFIL
        ==================================================== */}

        <div className="relative">

          <button
            type="button"
            onClick={() => {
              setMenuPerfilAbierto(
                (actual) =>
                  !actual
              );

              setMenuCrearAbierto(
                false
              );
            }}
            className="flex items-center gap-3 rounded-xl p-1.5 transition hover:bg-white/60"
          >

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#BFEDE7] text-xs font-bold text-[#0F766E]">
              SM
            </div>

            <div className="hidden text-left lg:block">

              <p className="text-sm font-semibold leading-tight text-[#1C2526]">
                Sergio Muñoz
              </p>

              <p className="mt-1 text-[11px] text-slate-500">
                Administrador
              </p>

            </div>

            <span
              className={`hidden text-xs text-slate-500 transition lg:block ${
                menuPerfilAbierto
                  ? "rotate-180"
                  : ""
              }`}
            >
              ▼
            </span>

          </button>

          {/* MENÚ PERFIL */}

          {menuPerfilAbierto && (

            <div className="absolute right-0 top-14 z-50 w-60 overflow-hidden rounded-xl border border-slate-300 bg-white shadow-xl">

              <div className="border-b border-slate-200 p-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#BFEDE7] text-xs font-bold text-[#0F766E]">
                    SM
                  </div>

                  <div>

                    <p className="text-sm font-bold text-[#1C2526]">
                      Sergio Muñoz
                    </p>

                    <p className="mt-0.5 text-xs text-slate-400">
                      Administrador
                    </p>

                  </div>

                </div>

              </div>

              <div className="p-2">

                <Link
                  href="/configuracion"
                  onClick={() =>
                    setMenuPerfilAbierto(
                      false
                    )
                  }
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-[#E8ECEC] hover:text-[#0F766E]"
                >
                  <span>
                    ⚙
                  </span>

                  Configuración
                </Link>

              </div>

              {/* LOGIN REAL MÁS ADELANTE */}

              <div className="border-t border-slate-200 px-4 py-3">

                <p className="text-[11px] leading-4 text-slate-400">
                  La cuenta y el cierre de sesión se conectarán con la autenticación de Laravel.
                </p>

              </div>

            </div>

          )}

        </div>

      </div>

    </header>
  );
}

/* ==========================================================
   OPCIÓN MENÚ CREAR
========================================================== */

function OpcionCrear({
  ruta,
  icono,
  titulo,
  cerrar,
}: {
  ruta: string;
  icono: string;
  titulo: string;
  cerrar: () => void;
}) {
  return (
    <Link
      href={ruta}
      onClick={cerrar}
      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-[#E8ECEC] hover:text-[#0F766E]"
    >

      <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#BFEDE7] text-[#0F766E]">
        {icono}
      </span>

      {titulo}

    </Link>
  );
}