"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuPrincipal = [
  {
    titulo: "Inicio",
    opciones: [
      {
        nombre: "Dashboard",
        ruta: "/",
        icono: "⌂",
      },
    ],
  },
  {
    titulo: "Ventas",
    opciones: [
      {
        nombre: "Presupuestos",
        ruta: "/presupuestos",
        icono: "▤",
      },
      {
        nombre: "Pedidos",
        ruta: "/pedidos",
        icono: "▣",
      },
      {
        nombre: "Albaranes",
        ruta: "/albaranes",
        icono: "▧",
      },
      {
        nombre: "Facturas",
        ruta: "/facturas",
        icono: "▥",
      },
    ],
  },
  {
    titulo: "Contactos",
    opciones: [
      {
        nombre: "Clientes",
        ruta: "/clientes",
        icono: "◎",
      },
      {
        nombre: "Proveedores",
        ruta: "/proveedores",
        icono: "◇",
      },
    ],
  },
  {
    titulo: "Catálogo",
    opciones: [
      {
        nombre: "Productos",
        ruta: "/productos",
        icono: "□",
      },
      {
        nombre: "Stock",
        ruta: "/stock",
        icono: "▦",
      },
    ],
  },
  {
    titulo: "Gestión",
    opciones: [
      {
        nombre: "Gastos",
        ruta: "/gastos",
        icono: "€",
      },
      {
        nombre: "Informes",
        ruta: "/informes",
        icono: "↗",
      },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-white/5 bg-[#181D1F] text-white">

      {/* ======================================================
          LOGO
      ====================================================== */}

      <div className="flex h-20 items-center border-b border-white/10 px-6">

        <Link href="/">
          <h1 className="text-[22px] font-bold tracking-tight">
            Gestion
            <span className="text-[#2DD4BF]">
              Pro
            </span>
          </h1>

          <p className="mt-0.5 text-[11px] font-medium tracking-wide text-slate-500">
            GESTIÓN EMPRESARIAL
          </p>
        </Link>

      </div>

      {/* ======================================================
          NAVEGACIÓN
      ====================================================== */}

      <nav className="flex-1 overflow-y-auto px-3 py-5">

        {menuPrincipal.map((grupo) => (

          <div
            key={grupo.titulo}
            className="mb-5"
          >

            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600">
              {grupo.titulo}
            </p>

            <div className="space-y-1">

              {grupo.opciones.map(
                (opcion) => {

                  const activo =
                    pathname ===
                    opcion.ruta;

                  return (
                    <Link
                      key={
                        opcion.nombre
                      }
                      href={
                        opcion.ruta
                      }
                      className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] font-medium transition-all duration-200 ${
                        activo
                          ? "bg-[#0F766E]/20 text-white"
                          : "text-slate-400 hover:bg-white/[0.06] hover:text-white"
                      }`}
                    >

                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-md text-base transition ${
                          activo
                            ? "bg-[#0F766E]/30 text-[#2DD4BF]"
                            : "text-slate-500 group-hover:bg-[#0F766E]/20 group-hover:text-[#2DD4BF]"
                        }`}
                      >
                        {
                          opcion.icono
                        }
                      </span>

                      <span>
                        {
                          opcion.nombre
                        }
                      </span>

                      {activo && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#2DD4BF]" />
                      )}

                    </Link>
                  );
                }
              )}

            </div>

          </div>

        ))}

      </nav>

      {/* ======================================================
          PARTE INFERIOR
      ====================================================== */}

      <div className="border-t border-white/10 p-3">

        <Link
          href="/configuracion"
          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
            pathname ===
            "/configuracion"
              ? "bg-[#0F766E]/20 text-white"
              : "text-slate-400 hover:bg-white/[0.06] hover:text-white"
          }`}
        >

          <span className="flex h-7 w-7 items-center justify-center">
            ⚙
          </span>

          Configuración

          {pathname ===
            "/configuracion" && (
            <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#2DD4BF]" />
          )}

        </Link>

        {/* EMPRESA */}

        <div className="mt-2 flex items-center gap-3 rounded-xl bg-white/[0.04] p-3">

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0F766E] text-xs font-bold text-white">
            GP
          </div>

          <div className="min-w-0">

            <p className="truncate text-xs font-semibold text-white">
              GestionPro
            </p>

            <p className="truncate text-[11px] text-slate-500">
              Empresa activa
            </p>

          </div>

        </div>

      </div>

    </aside>
  );
}