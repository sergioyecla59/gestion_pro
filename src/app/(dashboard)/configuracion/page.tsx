"use client";

import {
  FormEvent,
  useState,
} from "react";

import SettingsSection from "@/components/configuracion/SettingsSection";

/* ==========================================================
   TIPOS
========================================================== */

type Configuracion = {
  nombreComercial: string;
  razonSocial: string;
  nif: string;
  direccion: string;
  codigoPostal: string;
  localidad: string;
  provincia: string;
  telefono: string;
  email: string;

  seriePresupuestos: string;
  seriePedidos: string;
  serieAlbaranes: string;
  serieFacturas: string;

  ivaDefecto: string;

  moneda: string;
  idioma: string;
};

/* ==========================================================
   DATOS INICIALES
========================================================== */

const configuracionInicial: Configuracion = {
  nombreComercial: "GestionPro Demo",
  razonSocial: "Empresa Demo S.L.",
  nif: "B12345678",

  direccion: "Calle Ejemplo, 25",
  codigoPostal: "30510",
  localidad: "Yecla",
  provincia: "Murcia",

  telefono: "968 000 000",
  email: "administracion@empresa.es",

  seriePresupuestos: "PRE",
  seriePedidos: "PED",
  serieAlbaranes: "ALB",
  serieFacturas: "FAC",

  ivaDefecto: "21",

  moneda: "EUR",
  idioma: "es",
};

/* ==========================================================
   PÁGINA
========================================================== */

export default function ConfiguracionPage() {
  const [
    configuracion,
    setConfiguracion,
  ] = useState<Configuracion>(
    configuracionInicial
  );

  const [
    guardado,
    setGuardado,
  ] = useState(false);

  /* ==========================================================
     CAMBIAR CAMPO
  ========================================================== */

  function cambiarCampo(
    campo: keyof Configuracion,
    valor: string
  ) {
    setConfiguracion(
      (actual) => ({
        ...actual,
        [campo]: valor,
      })
    );

    setGuardado(false);
  }

  /* ==========================================================
     GUARDAR
  ========================================================== */

  function guardarConfiguracion(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setGuardado(true);
  }

  return (
    <form
      onSubmit={guardarConfiguracion}
    >

      {/* ======================================================
          CABECERA
      ====================================================== */}

      <section className="flex items-end justify-between">

        <div>

          <p className="mb-1 text-xs font-bold uppercase tracking-[0.14em] text-[#5EEAD4]">
            Sistema
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-white">
            Configuración
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Gestiona los datos y preferencias generales de tu empresa.
          </p>

        </div>

        <button
          type="submit"
          className="rounded-xl bg-[#0F766E] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#115E59]"
        >
          Guardar cambios
        </button>

      </section>

      {/* MENSAJE GUARDADO */}

      {guardado && (

        <div className="mt-5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3">

          <p className="text-sm font-semibold text-emerald-300">
            ✓ Configuración guardada correctamente.
          </p>

        </div>

      )}

      {/* ======================================================
          DATOS DE EMPRESA
      ====================================================== */}

      <div className="mt-6">

        <SettingsSection
          titulo="Datos de empresa"
          descripcion="Información general y fiscal de la empresa."
        >

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            <Campo
              titulo="Nombre comercial"
              valor={
                configuracion.nombreComercial
              }
              cambiar={(valor) =>
                cambiarCampo(
                  "nombreComercial",
                  valor
                )
              }
            />

            <Campo
              titulo="Razón social"
              valor={
                configuracion.razonSocial
              }
              cambiar={(valor) =>
                cambiarCampo(
                  "razonSocial",
                  valor
                )
              }
            />

            <Campo
              titulo="NIF / CIF"
              valor={configuracion.nif}
              cambiar={(valor) =>
                cambiarCampo(
                  "nif",
                  valor
                )
              }
            />

            <Campo
              titulo="Teléfono"
              valor={
                configuracion.telefono
              }
              cambiar={(valor) =>
                cambiarCampo(
                  "telefono",
                  valor
                )
              }
            />

            <div className="md:col-span-2">

              <Campo
                titulo="Email"
                tipo="email"
                valor={
                  configuracion.email
                }
                cambiar={(valor) =>
                  cambiarCampo(
                    "email",
                    valor
                  )
                }
              />

            </div>

          </div>

        </SettingsSection>

      </div>

      {/* ======================================================
          DIRECCIÓN
      ====================================================== */}

      <div className="mt-5">

        <SettingsSection
          titulo="Dirección"
          descripcion="Dirección fiscal o principal de la empresa."
        >

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            <div className="md:col-span-2">

              <Campo
                titulo="Dirección"
                valor={
                  configuracion.direccion
                }
                cambiar={(valor) =>
                  cambiarCampo(
                    "direccion",
                    valor
                  )
                }
              />

            </div>

            <Campo
              titulo="Código postal"
              valor={
                configuracion.codigoPostal
              }
              cambiar={(valor) =>
                cambiarCampo(
                  "codigoPostal",
                  valor
                )
              }
            />

            <Campo
              titulo="Localidad"
              valor={
                configuracion.localidad
              }
              cambiar={(valor) =>
                cambiarCampo(
                  "localidad",
                  valor
                )
              }
            />

            <Campo
              titulo="Provincia"
              valor={
                configuracion.provincia
              }
              cambiar={(valor) =>
                cambiarCampo(
                  "provincia",
                  valor
                )
              }
            />

          </div>

        </SettingsSection>

      </div>

      {/* ======================================================
          FACTURACIÓN
      ====================================================== */}

      <div className="mt-5">

        <SettingsSection
          titulo="Facturación y documentos"
          descripcion="Configura las series utilizadas para numerar los documentos comerciales."
        >

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

            <Campo
              titulo="Presupuestos"
              valor={
                configuracion.seriePresupuestos
              }
              cambiar={(valor) =>
                cambiarCampo(
                  "seriePresupuestos",
                  valor
                )
              }
            />

            <Campo
              titulo="Pedidos"
              valor={
                configuracion.seriePedidos
              }
              cambiar={(valor) =>
                cambiarCampo(
                  "seriePedidos",
                  valor
                )
              }
            />

            <Campo
              titulo="Albaranes"
              valor={
                configuracion.serieAlbaranes
              }
              cambiar={(valor) =>
                cambiarCampo(
                  "serieAlbaranes",
                  valor
                )
              }
            />

            <Campo
              titulo="Facturas"
              valor={
                configuracion.serieFacturas
              }
              cambiar={(valor) =>
                cambiarCampo(
                  "serieFacturas",
                  valor
                )
              }
            />

          </div>

          {/* EJEMPLOS */}

          <div className="mt-6 rounded-xl border border-slate-300 bg-[#F5F7F7] p-4">

            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Ejemplo de numeración
            </p>

            <div className="mt-3 flex flex-wrap gap-2">

              <Etiqueta>
                {configuracion.seriePresupuestos}
                -2026-001
              </Etiqueta>

              <Etiqueta>
                {configuracion.seriePedidos}
                -2026-001
              </Etiqueta>

              <Etiqueta>
                {configuracion.serieAlbaranes}
                -2026-001
              </Etiqueta>

              <Etiqueta>
                {configuracion.serieFacturas}
                -2026-001
              </Etiqueta>

            </div>

          </div>

          {/* IVA */}

          <div className="mt-6 max-w-xs">

            <label className="mb-2 block text-xs font-semibold text-slate-600">
              IVA por defecto
            </label>

            <div className="relative">

              <input
                type="number"
                min="0"
                max="100"
                value={
                  configuracion.ivaDefecto
                }
                onChange={(event) =>
                  cambiarCampo(
                    "ivaDefecto",
                    event.target.value
                  )
                }
                className="h-11 w-full rounded-xl border border-slate-300 bg-[#F5F7F7] px-3 pr-10 text-sm text-slate-700 outline-none focus:border-[#0F766E]"
              />

              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                %
              </span>

            </div>

          </div>

        </SettingsSection>

      </div>

      {/* ======================================================
          PREFERENCIAS
      ====================================================== */}

      <div className="mt-5">

        <SettingsSection
          titulo="Preferencias"
          descripcion="Opciones generales de funcionamiento de GestionPro."
        >

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            {/* MONEDA */}

            <div>

              <label className="mb-2 block text-xs font-semibold text-slate-600">
                Moneda
              </label>

              <select
                value={
                  configuracion.moneda
                }
                onChange={(event) =>
                  cambiarCampo(
                    "moneda",
                    event.target.value
                  )
                }
                className="h-11 w-full rounded-xl border border-slate-300 bg-[#F5F7F7] px-3 text-sm text-slate-700 outline-none focus:border-[#0F766E]"
              >

                <option value="EUR">
                  Euro (€)
                </option>

                <option value="USD">
                  Dólar ($)
                </option>

                <option value="GBP">
                  Libra (£)
                </option>

              </select>

            </div>

            {/* IDIOMA */}

            <div>

              <label className="mb-2 block text-xs font-semibold text-slate-600">
                Idioma
              </label>

              <select
                value={
                  configuracion.idioma
                }
                onChange={(event) =>
                  cambiarCampo(
                    "idioma",
                    event.target.value
                  )
                }
                className="h-11 w-full rounded-xl border border-slate-300 bg-[#F5F7F7] px-3 text-sm text-slate-700 outline-none focus:border-[#0F766E]"
              >

                <option value="es">
                  Español
                </option>

                <option value="en">
                  English
                </option>

              </select>

            </div>

          </div>

        </SettingsSection>

      </div>

      {/* ======================================================
          USUARIOS
      ====================================================== */}

      <div className="mt-5">

        <SettingsSection
          titulo="Usuarios y permisos"
          descripcion="Control de acceso de los trabajadores de la empresa."
        >

          <div className="flex flex-col gap-4 rounded-xl border border-slate-300 bg-[#F5F7F7] p-5 md:flex-row md:items-center md:justify-between">

            <div>

              <p className="text-sm font-bold text-[#1C2526]">
                Gestión de usuarios
              </p>

              <p className="mt-1 max-w-xl text-xs leading-5 text-slate-500">
                Los usuarios, roles y permisos se configurarán cuando conectemos GestionPro con Laravel y el sistema de autenticación.
              </p>

            </div>

            <span className="w-fit rounded-full bg-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-500">
              Próximamente
            </span>

          </div>

        </SettingsSection>

      </div>

      {/* BOTÓN INFERIOR */}

      <div className="mt-6 flex justify-end">

        <button
          type="submit"
          className="rounded-xl bg-[#0F766E] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#115E59]"
        >
          Guardar cambios
        </button>

      </div>

    </form>
  );
}

/* ==========================================================
   CAMPO
========================================================== */

function Campo({
  titulo,
  valor,
  cambiar,
  tipo = "text",
}: {
  titulo: string;
  valor: string;
  cambiar: (valor: string) => void;
  tipo?: string;
}) {
  return (
    <div>

      <label className="mb-2 block text-xs font-semibold text-slate-600">
        {titulo}
      </label>

      <input
        type={tipo}
        value={valor}
        onChange={(event) =>
          cambiar(event.target.value)
        }
        className="h-11 w-full rounded-xl border border-slate-300 bg-[#F5F7F7] px-3 text-sm text-slate-700 outline-none transition focus:border-[#0F766E]"
      />

    </div>
  );
}

/* ==========================================================
   ETIQUETA
========================================================== */

function Etiqueta({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-[#0F766E]">
      {children}
    </span>
  );
}