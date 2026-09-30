"use client";

import { useEffect, useState } from "react";

import type { EstadoPedido, Pedido } from "./NewOrderPanel";

type Props = {
  pedido: Pedido | null;
  cerrar: () => void;
  cambiarEstado: (id: number, estado: EstadoPedido) => void;
  alCrearAlbaran?: (numeroAlbaran: string) => void;
  alAnular?: () => void;
};

const estados: EstadoPedido[] = [
  "Pendiente",
  "Preparando",
  "Enviado",
  "Completado",
  "Anulado",
];

/* Estados que el usuario puede pulsar. */
const estadosManuales: EstadoPedido[] = ["Preparando", "Anulado"];

/* Estados desde los que se puede generar un albarán. */
const estadosPermitenAlbaran: EstadoPedido[] = [
  "Preparando",
  "Enviado",
  "Completado",
];

export default function OrderDetailPanel({
  pedido,
  cerrar,
  cambiarEstado,
  alCrearAlbaran,
  alAnular,
}: Props) {
  const [creandoAlbaran, setCreandoAlbaran] = useState(false);
  const [errorAlbaran, setErrorAlbaran] = useState("");
  const [numeroAlbaran, setNumeroAlbaran] = useState("");
  const [albaranExistente, setAlbaranExistente] = useState<string | null>(null);

  const [mostrarAnular, setMostrarAnular] = useState(false);
  const [motivoAnulacion, setMotivoAnulacion] = useState("");
  const [anulando, setAnulando] = useState(false);
  const [errorAnular, setErrorAnular] = useState("");

  /*
   * Al abrir el panel se comprueba si el pedido ya
   * tiene albarán.
   */
  useEffect(() => {
    let cancelado = false;

    if (!pedido) return;

    async function comprobarAlbaran() {
      try {
        const respuesta = await fetch(
          "http://127.0.0.1:8000/api/pedidos/" + pedido!.id
        );

        if (!respuesta.ok) return;

        const datos = await respuesta.json();

        if (cancelado) return;

        setAlbaranExistente(datos.albaran ? datos.albaran.numero : null);
      } catch (err) {
        console.error(err);
      }
    }

    comprobarAlbaran();

    return () => {
      cancelado = true;
    };
  }, [pedido]);

  if (!pedido) return null;

  /* ==========================================================
     CREAR ALBARÁN
  ========================================================== */

  async function crearAlbaran() {
    setCreandoAlbaran(true);
    setErrorAlbaran("");

    try {
      const respuesta = await fetch(
        "http://127.0.0.1:8000/api/pedidos/" + pedido!.id + "/crear-albaran",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({}),
        }
      );

      const datos = await respuesta.json().catch(() => null);

      if (!respuesta.ok) {
        throw new Error(
          datos ? datos.message : "No se ha podido crear el albarán."
        );
      }

      const numero = datos ? datos.numero : "";

      setNumeroAlbaran(numero);
      setAlbaranExistente(numero);

      alCrearAlbaran?.(numero);
    } catch (err) {
      setErrorAlbaran(
        err instanceof Error ? err.message : "Ha ocurrido un error al crear el albarán."
      );
    } finally {
      setCreandoAlbaran(false);
    }
  }

  /* ==========================================================
     ANULAR
  ========================================================== */

  async function anularPedido() {
    if (!motivoAnulacion.trim()) {
      setErrorAnular("Escribe el motivo de la anulación.");

      return;
    }

    setAnulando(true);
    setErrorAnular("");

    try {
      const respuesta = await fetch(
        "http://127.0.0.1:8000/api/pedidos/" + pedido!.id + "/anular",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ motivo: motivoAnulacion.trim() }),
        }
      );

      const datos = await respuesta.json().catch(() => null);

      if (!respuesta.ok) {
        throw new Error(
          datos ? datos.message : "No se ha podido anular el pedido."
        );
      }

      setMostrarAnular(false);
      setMotivoAnulacion("");

      alAnular?.();
    } catch (err) {
      setErrorAnular(
        err instanceof Error ? err.message : "Ha ocurrido un error al anular el pedido."
      );
    } finally {
      setAnulando(false);
    }
  }

  const puedeCrearAlbaran = estadosPermitenAlbaran.includes(pedido.estado);

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
        onClick={cerrar}
      />

      <aside className="fixed right-0 top-0 z-50 flex h-screen w-full max-w-2xl flex-col bg-[#E8ECEC] shadow-2xl">
        {/* CABECERA */}

        <div className="border-b border-slate-300 px-6 py-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0F766E]">
                Pedido
              </p>

              <h2 className="mt-1 text-xl font-bold text-[#1C2526]">
                {pedido.numero}
              </h2>

              <p className="mt-1 text-sm text-slate-500">{pedido.cliente}</p>
            </div>

            <button
              onClick={cerrar}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-[#F5F7F7] text-lg text-slate-500"
            >
              ×
            </button>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <Estado estado={pedido.estado} />

            <span className="text-xs text-slate-500">{pedido.fecha}</span>
          </div>
        </div>

        {/* CONTENIDO */}

        <div className="flex-1 overflow-y-auto p-6">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
            Información general
          </p>

          <div className="grid grid-cols-2 gap-3">
            <Dato titulo="Cliente" valor={pedido.cliente} />

            <Dato titulo="Fecha" valor={pedido.fecha} />

            <Dato titulo="Origen" valor={pedido.origen} />

            <Dato titulo="Estado" valor={pedido.estado} />
          </div>

          {/* PRODUCTOS */}

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
                  {pedido.lineas.map((linea) => (
                    <tr
                      key={linea.id}
                      className="border-b border-slate-200 last:border-0"
                    >
                      <td className="px-4 py-3">
                        <p className="text-sm font-semibold text-[#1C2526]">
                          {linea.producto}
                        </p>

                        <p className="text-xs text-slate-400">
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

          {/* TOTALES */}

          <div className="mt-5 ml-auto w-full max-w-xs rounded-xl border border-slate-300 bg-[#F5F7F7] p-4">
            <FilaTotal titulo="Subtotal" valor={pedido.subtotal} />

            <FilaTotal titulo="IVA (21%)" valor={pedido.iva} />

            <div className="my-3 border-t border-slate-300" />

            <div className="flex justify-between">
              <span className="text-sm font-bold text-[#1C2526]">Total</span>

              <span className="text-lg font-bold text-[#0F766E]">
                {formatearDinero(pedido.total)}
              </span>
            </div>
          </div>

          {/* ESTADO */}

          <div className="mt-7">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
              Estado del pedido
            </p>

            <div className="rounded-xl border border-slate-300 bg-[#F5F7F7] p-4">
              <div className="flex flex-wrap gap-2">
                {estados.map((estado) => {
                  const manual = estadosManuales.includes(estado);

                  const activo = pedido.estado === estado;

                  return (
                    <button
                      key={estado}
                      type="button"
                      disabled={!manual}
                      onClick={() => {
                        if (estado === "Anulado") {
                          setMostrarAnular(true);
                          setErrorAnular("");
                        } else {
                          cambiarEstado(pedido.id, estado);
                        }
                      }}
                      className={
                        "rounded-lg border px-3 py-2 text-xs font-semibold transition " +
                        (activo
                          ? "border-[#0F766E] bg-[#0F766E] text-white"
                          : manual
                            ? "border-slate-300 bg-white text-slate-600 hover:border-[#0F766E]"
                            : "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400")
                      }
                    >
                      {estado}
                    </button>
                  );
                })}
              </div>

              <p className="mt-3 text-[11px] leading-5 text-slate-500">
                «Enviado» y «Completado» se asignan automáticamente: el primero
                al crear el albarán y el segundo al marcarlo como entregado.
              </p>
            </div>
          </div>

          {/* ANULAR */}

          {mostrarAnular && pedido.estado !== "Anulado" && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-bold text-red-700">Anular pedido</p>

              <p className="mt-1 text-xs leading-5 text-slate-600">
                El pedido no se borra: queda anulado con su motivo, para dejar
                constancia.
              </p>

              {errorAnular ? (
                <div className="mt-3 rounded-lg border border-red-200 bg-white px-3 py-2">
                  <p className="text-xs font-semibold text-red-700">
                    {errorAnular}
                  </p>
                </div>
              ) : null}

              <div className="mt-3">
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Motivo *
                </label>

                <textarea
                  value={motivoAnulacion}
                  onChange={(evento) => setMotivoAnulacion(evento.target.value)}
                  rows={3}
                  placeholder="Ej. El cliente canceló el pedido..."
                  className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-[#0F766E]"
                />
              </div>

              <div className="mt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setMostrarAnular(false);
                    setErrorAnular("");
                  }}
                  disabled={anulando}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 disabled:opacity-50"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={anularPedido}
                  disabled={anulando}
                  className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
                >
                  {anulando ? "Anulando..." : "Anular pedido"}
                </button>
              </div>
            </div>
          )}

          {/* YA ANULADO */}

          {pedido.estado === "Anulado" && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-bold text-red-700">Pedido anulado</p>

              <p className="mt-1 text-xs leading-5 text-slate-600">
                Este pedido está anulado y no admite cambios de estado. Se
                conserva en el histórico.
              </p>
            </div>
          )}

          {/* CREAR ALBARÁN */}

          {puedeCrearAlbaran && pedido.estado !== "Anulado" && (
            <div className="mt-5 rounded-xl border border-[#0F766E]/20 bg-[#BFEDE7]/50 p-4">
              {albaranExistente || numeroAlbaran ? (
                <>
                  <p className="text-sm font-bold text-[#0F766E]">
                    Albarán creado
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-600">
                    Este pedido ya tiene el albarán{" "}
                    <span className="font-semibold text-[#0F766E]">
                      {numeroAlbaran || albaranExistente}
                    </span>
                    . Puedes consultarlo en el módulo de Albaranes.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm font-bold text-[#0F766E]">
                    Pedido listo para entregar
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-600">
                    Al crear el albarán, el pedido pasará a «Enviado»
                    automáticamente. Cuando el albarán se marque como entregado,
                    este pedido se completará solo.
                  </p>

                  {errorAlbaran ? (
                    <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2">
                      <p className="text-xs font-semibold text-red-700">
                        {errorAlbaran}
                      </p>
                    </div>
                  ) : null}

                  <button
                    type="button"
                    onClick={crearAlbaran}
                    disabled={creandoAlbaran}
                    className="mt-3 w-full rounded-xl bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#115E59] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {creandoAlbaran ? "Creando albarán..." : "Crear albarán"}
                  </button>
                </>
              )}
            </div>
          )}

          {/* PENDIENTE */}

          {pedido.estado === "Pendiente" && (
            <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-bold text-amber-700">
                Pedido pendiente de preparación
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-600">
                Pulsa «Preparando» cuando el almacén empiece con él. Entonces
                podrás generar su albarán.
              </p>
            </div>
          )}
        </div>

        {/* PIE */}

        <div className="flex justify-end border-t border-slate-300 bg-[#DDE2E2] px-6 py-4">
          <button
            onClick={cerrar}
            className="rounded-xl bg-[#0F766E] px-5 py-2.5 text-sm font-semibold text-white"
          >
            Cerrar
          </button>
        </div>
      </aside>
    </>
  );
}

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

function Estado({ estado }: { estado: EstadoPedido }) {
  const estilos: Record<EstadoPedido, string> = {
    Pendiente: "bg-amber-100 text-amber-700",
    Preparando: "bg-blue-100 text-blue-700",
    Enviado: "bg-violet-100 text-violet-700",
    Completado: "bg-emerald-100 text-emerald-700",
    Anulado: "bg-slate-200 text-slate-600",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${estilos[estado]}`}
    >
      {estado}
    </span>
  );
}

function formatearDinero(cantidad: number) {
  const numero = cantidad.toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return numero + " €";
}
