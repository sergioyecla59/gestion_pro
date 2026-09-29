"use client";

import { useState } from "react";
import type { Presupuesto } from "./NewBudgetPanel";

type Props = {
  presupuesto: Presupuesto | null;
  cerrar: () => void;
  editar: (presupuesto: Presupuesto) => void;
};

/* ==========================================================
   COMPONENTE PRINCIPAL
========================================================== */

export default function BudgetDetailPanel({
  presupuesto,
  cerrar,
  editar,
}: Props) {
  if (!presupuesto) {
    return null;
  }

  return (
    <BudgetDetailContent
      key={presupuesto.id}
      presupuesto={presupuesto}
      cerrar={cerrar}
      editar={editar}
    />
  );
}

/* ==========================================================
   CONTENIDO DEL PANEL
========================================================== */

function BudgetDetailContent({
  presupuesto,
  cerrar,
  editar,
}: {
  presupuesto: Presupuesto;
  cerrar: () => void;
  editar: (presupuesto: Presupuesto) => void;
}) {
  const [mostrarEmail, setMostrarEmail] = useState(false);

  const [emailDestinatario, setEmailDestinatario] = useState(
    presupuesto.clienteEmail,
  );
  const [asunto, setAsunto] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [adjuntarPdf, setAdjuntarPdf] = useState(true);

  const [enviando, setEnviando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");
  const [mensajeError, setMensajeError] = useState("");

  /* ==========================================================
     DESCARGAR PDF
  ========================================================== */

  function descargarPdf() {
    const url = `http://127.0.0.1:8000/api/presupuestos/${presupuesto.id}/pdf`;

    window.open(url, "_blank");
  }

  /* ==========================================================
     ABRIR FORMULARIO DE EMAIL
  ========================================================== */

  function abrirFormularioEmail() {
    setMostrarEmail(true);
    setMensajeExito("");
    setMensajeError("");

    setAsunto(`Presupuesto ${presupuesto.numero}`);

    setMensaje(
      `Hola ${presupuesto.cliente},\n\nTe enviamos el presupuesto ${presupuesto.numero} para que puedas revisarlo.\n\nPuedes consultar todos los detalles y responder al presupuesto desde el enlace incluido en este correo.\n\nUn saludo.`,
    );
  }

  /* ==========================================================
     CERRAR FORMULARIO DE EMAIL
  ========================================================== */

  function cerrarFormularioEmail() {
    if (enviando) {
      return;
    }

    setMostrarEmail(false);
    setMensajeExito("");
    setMensajeError("");
  }

  /* ==========================================================
     ENVIAR PRESUPUESTO POR EMAIL
  ========================================================== */

  async function enviarEmail() {
    if (!emailDestinatario.trim()) {
      setMensajeError("Introduce el email del destinatario.");
      return;
    }

    setEnviando(true);
    setMensajeExito("");
    setMensajeError("");

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/presupuestos/${presupuesto.id}/enviar-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            email_destinatario: emailDestinatario.trim(),
            asunto: asunto.trim() || null,
            mensaje: mensaje.trim() || null,
            adjuntar_pdf: adjuntarPdf,
          }),
        },
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message || "No se ha podido enviar el presupuesto por email.",
        );
      }

      setMensajeExito(
        data?.message ||
          "Presupuesto enviado correctamente por correo electrónico.",
      );
    } catch (error) {
      setMensajeError(
        error instanceof Error
          ? error.message
          : "Ha ocurrido un error al enviar el presupuesto.",
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
        onClick={cerrar}
      />

      <aside className="fixed right-0 top-0 z-50 flex h-screen w-full max-w-2xl flex-col bg-[#E8ECEC] shadow-2xl">
        {/* =====================================================
            CABECERA
        ===================================================== */}

        <div className="border-b border-slate-300 px-6 py-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0F766E]">
                Presupuesto
              </p>

              <h2 className="mt-1 text-xl font-bold text-[#1C2526]">
                {presupuesto.numero}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {presupuesto.cliente}
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

          <div className="mt-4 flex items-center gap-3">
            <Estado estado={presupuesto.estado} />

            <span className="text-xs text-slate-500">
              Fecha: {presupuesto.fecha}
            </span>
          </div>
        </div>

        {/* =====================================================
            CONTENIDO
        ===================================================== */}

        <div className="flex-1 overflow-y-auto p-6">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
            Información general
          </p>

          <div className="grid grid-cols-2 gap-3">
            <Dato titulo="Cliente" valor={presupuesto.cliente} />

            <Dato titulo="Fecha" valor={presupuesto.fecha} />

            <Dato titulo="Validez" valor={presupuesto.validez} />

            <Dato titulo="Estado" valor={presupuesto.estado} />
          </div>

          {/* =====================================================
              PRODUCTOS
          ===================================================== */}

          <div className="mt-7">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
              Productos
            </p>

            <div className="overflow-hidden rounded-xl border border-slate-300 bg-[#F5F7F7]">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-300 bg-[#DDE2E2] text-left">
                    <th className="px-4 py-3 text-[11px] font-semibold uppercase text-slate-500">
                      Producto
                    </th>

                    <th className="px-4 py-3 text-[11px] font-semibold uppercase text-slate-500">
                      Cant.
                    </th>

                    <th className="px-4 py-3 text-[11px] font-semibold uppercase text-slate-500">
                      Precio
                    </th>

                    <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase text-slate-500">
                      Importe
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {presupuesto.lineas.map((linea) => (
                    <tr
                      key={linea.id}
                      className="border-b border-slate-200 last:border-0"
                    >
                      <td className="px-4 py-3">
                        <p className="text-sm font-semibold text-[#1C2526]">
                          {linea.producto}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-400">
                          {linea.referencia}
                        </p>
                      </td>

                      <td className="px-4 py-3 text-sm text-slate-600">
                        {linea.cantidad}
                      </td>

                      <td className="px-4 py-3 text-sm text-slate-600">
                        {formatearDinero(linea.precio)}
                      </td>

                      <td className="px-4 py-3 text-right text-sm font-semibold text-slate-700">
                        {formatearDinero(linea.precio * linea.cantidad)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* =====================================================
              TOTALES
          ===================================================== */}

          <div className="mt-5 ml-auto w-full max-w-xs rounded-xl border border-slate-300 bg-[#F5F7F7] p-4">
            <FilaTotal titulo="Subtotal" valor={presupuesto.subtotal} />

            <FilaTotal titulo="IVA (21%)" valor={presupuesto.iva} />

            <div className="my-3 border-t border-slate-300" />

            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-[#1C2526]">Total</span>

              <span className="text-lg font-bold text-[#0F766E]">
                {formatearDinero(presupuesto.total)}
              </span>
            </div>
          </div>

          {/* =====================================================
              PRESUPUESTO ACEPTADO
          ===================================================== */}

          {presupuesto.estado === "Aceptado" && (
            <div className="mt-5 rounded-xl border border-[#0F766E]/20 bg-[#BFEDE7]/50 p-4">
              <p className="text-sm font-bold text-[#0F766E]">
                Presupuesto aceptado
              </p>

              <p className="mt-1 text-xs text-slate-600">
                Este presupuesto está preparado para convertirse en pedido.
              </p>
            </div>
          )}

          {/* =====================================================
              FORMULARIO ENVÍO EMAIL
          ===================================================== */}

          {mostrarEmail && (
            <div className="mt-6 rounded-2xl border border-slate-300 bg-[#F5F7F7] p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#0F766E]">
                    Enviar presupuesto
                  </p>

                  <h3 className="mt-1 text-lg font-bold text-[#1C2526]">
                    Enviar por email
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    El cliente recibirá el enlace al presupuesto online.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={cerrarFormularioEmail}
                  disabled={enviando}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-500 disabled:opacity-50"
                >
                  ×
                </button>
              </div>

              {/* DESTINATARIO */}

              <div className="mt-5">
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Destinatario
                </label>

                <input
                  type="email"
                  value={emailDestinatario}
                  onChange={(e) => setEmailDestinatario(e.target.value)}
                  placeholder="cliente@empresa.com"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10"
                />
              </div>

              {/* ASUNTO */}

              <div className="mt-4">
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Asunto
                </label>

                <input
                  type="text"
                  value={asunto}
                  onChange={(e) => setAsunto(e.target.value)}
                  placeholder="Asunto del correo"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10"
                />
              </div>

              {/* MENSAJE */}

              <div className="mt-4">
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Mensaje
                </label>

                <textarea
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  rows={5}
                  placeholder="Escribe un mensaje para el cliente..."
                  className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10"
                />
              </div>

              {/* ADJUNTAR PDF */}

              <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                <input
                  type="checkbox"
                  checked={adjuntarPdf}
                  onChange={(e) => setAdjuntarPdf(e.target.checked)}
                  className="h-4 w-4 accent-[#0F766E]"
                />

                <div>
                  <p className="text-sm font-semibold text-slate-700">
                    Adjuntar presupuesto en PDF
                  </p>

                  <p className="text-xs text-slate-400">
                    Se incluirá una copia del presupuesto como archivo adjunto.
                  </p>
                </div>
              </label>

              {/* ERROR */}

              {mensajeError && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                  <p className="text-sm font-semibold text-red-700">
                    {mensajeError}
                  </p>
                </div>
              )}

              {/* ÉXITO */}

              {mensajeExito && (
                <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                  <p className="text-sm font-semibold text-emerald-700">
                    {mensajeExito}
                  </p>
                </div>
              )}

              {/* BOTONES FORMULARIO */}

              <div className="mt-5 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={cerrarFormularioEmail}
                  disabled={enviando}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={enviarEmail}
                  disabled={enviando}
                  className="rounded-xl bg-[#0F766E] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#115E59] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {enviando ? "Enviando..." : "Enviar presupuesto"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* =====================================================
            PIE / ACCIONES
        ===================================================== */}

        <div className="flex flex-wrap justify-end gap-3 border-t border-slate-300 bg-[#DDE2E2] px-6 py-4">
          {/* DESCARGAR PDF */}

          <button
            type="button"
            onClick={descargarPdf}
            className="rounded-xl border border-slate-400 bg-[#F5F7F7] px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-white"
          >
            Descargar PDF
          </button>

          {/* ENVIAR EMAIL */}

          <button
            type="button"
            onClick={abrirFormularioEmail}
            className="rounded-xl border border-[#0F766E] bg-[#F5F7F7] px-5 py-2.5 text-sm font-semibold text-[#0F766E] transition hover:bg-[#BFEDE7]"
          >
            Enviar por email
          </button>

          {/* EDITAR */}

          <button
            type="button"
            onClick={() => editar(presupuesto)}
            className="rounded-xl border border-[#0F766E] bg-[#F5F7F7] px-5 py-2.5 text-sm font-semibold text-[#0F766E] transition hover:bg-[#BFEDE7]"
          >
            Editar
          </button>

          {/* CERRAR */}

          <button
            type="button"
            onClick={cerrar}
            className="rounded-xl bg-[#0F766E] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#115E59]"
          >
            Cerrar
          </button>
        </div>
      </aside>
    </>
  );
}

/* ==========================================================
   COMPONENTE DATO
========================================================== */

function Dato({ titulo, valor }: { titulo: string; valor: string }) {
  return (
    <div className="rounded-xl border border-slate-300 bg-[#F5F7F7] p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        {titulo}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-700">{valor}</p>
    </div>
  );
}

/* ==========================================================
   FILA TOTAL
========================================================== */

function FilaTotal({ titulo, valor }: { titulo: string; valor: number }) {
  return (
    <div className="mb-2 flex justify-between text-sm">
      <span className="text-slate-500">{titulo}</span>

      <span className="font-semibold text-slate-700">
        {formatearDinero(valor)}
      </span>
    </div>
  );
}

/* ==========================================================
   ESTADO
========================================================== */

function Estado({
  estado,
}: {
  estado: "Pendiente" | "Aceptado" | "Rechazado";
}) {
  const estilos = {
    Pendiente: "bg-amber-100 text-amber-700",
    Aceptado: "bg-emerald-100 text-emerald-700",
    Rechazado: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${estilos[estado]}`}
    >
      {estado}
    </span>
  );
}

/* ==========================================================
   FORMATEAR DINERO
========================================================== */

function formatearDinero(cantidad: number) {
  return `${cantidad.toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} €`;
}
