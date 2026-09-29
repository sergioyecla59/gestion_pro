"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

/* ==========================================================
   TIPOS
========================================================== */

type Empresa = {
  nombre_comercial: string;
  razon_social: string;
  nif: string;
  email: string;
  telefono: string;
  direccion: string;
  codigo_postal: string;
  localidad: string;
  provincia: string;
  pais: string;
};

type Cliente = {
  nombre: string;
  nif: string;
  email: string;
  telefono: string;
  direccion: string;
  codigo_postal: string;
  localidad: string;
  provincia: string;
  pais: string;
};

type LineaPresupuesto = {
  id: number;
  descripcion: string;
  cantidad: string;
  precio_unitario: string;
  porcentaje_iva: string;
  subtotal: string;
};

type Presupuesto = {
  id: number;
  numero: string;
  fecha: string;
  valido_hasta: string;
  estado: string;
  base_imponible: string;
  iva: string;
  total: string;
  notas: string | null;
  fecha_aceptacion: string | null;
  fecha_rechazo: string | null;
  motivo_rechazo: string | null;
  empresa: Empresa;
  cliente: Cliente;
  lineas: LineaPresupuesto[];
};

type RespuestaApi = {
  presupuesto: Presupuesto;
  caducado: boolean;
};

/* ==========================================================
   PÁGINA PÚBLICA DEL PRESUPUESTO
========================================================== */

export default function PresupuestoPublicoPage() {
  const params = useParams();

  const token = params.token as string;

  const [presupuesto, setPresupuesto] =
    useState<Presupuesto | null>(null);

  const [caducado, setCaducado] = useState(false);

  const [cargando, setCargando] = useState(true);

  const [error, setError] = useState("");

  const [procesando, setProcesando] = useState(false);

  const [mostrarRechazo, setMostrarRechazo] = useState(false);

  const [motivoRechazo, setMotivoRechazo] = useState("");

  const [mensaje, setMensaje] = useState("");

  /* ==========================================================
     CARGAR PRESUPUESTO DESDE LARAVEL
  ========================================================== */

  useEffect(() => {
    async function cargarPresupuesto() {
      try {
        setCargando(true);
        setError("");

        const respuesta = await fetch(
          `http://127.0.0.1:8000/api/public/presupuestos/${token}`
        );

        if (!respuesta.ok) {
          throw new Error("No se pudo cargar el presupuesto.");
        }

        const datos: RespuestaApi = await respuesta.json();

        setPresupuesto(datos.presupuesto);
        setCaducado(datos.caducado);
      } catch (error) {
        console.error(error);

        setError(
          "No hemos podido encontrar este presupuesto o ya no está disponible."
        );
      } finally {
        setCargando(false);
      }
    }

    if (token) {
      cargarPresupuesto();
    }
  }, [token]);

  /* ==========================================================
     ACEPTAR PRESUPUESTO
  ========================================================== */

  async function aceptarPresupuesto() {
    try {
      setProcesando(true);
      setMensaje("");

      const respuesta = await fetch(
        `http://127.0.0.1:8000/api/public/presupuestos/${token}/aceptar`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          datos.message || "No se pudo aceptar el presupuesto."
        );
      }

      setPresupuesto((anterior) =>
        anterior
          ? {
              ...anterior,
              estado: "Aceptado",
              fecha_aceptacion:
                datos.presupuesto?.fecha_aceptacion ?? null,
            }
          : anterior
      );

      setMensaje("Presupuesto aceptado correctamente.");
    } catch (error) {
      console.error(error);

      setMensaje(
        error instanceof Error
          ? error.message
          : "Ha ocurrido un error al aceptar el presupuesto."
      );
    } finally {
      setProcesando(false);
    }
  }

  /* ==========================================================
     RECHAZAR PRESUPUESTO
  ========================================================== */

  async function rechazarPresupuesto() {
    try {
      setProcesando(true);
      setMensaje("");

      const respuesta = await fetch(
        `http://127.0.0.1:8000/api/public/presupuestos/${token}/rechazar`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            motivo: motivoRechazo.trim() || null,
          }),
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          datos.message || "No se pudo rechazar el presupuesto."
        );
      }

      setPresupuesto((anterior) =>
        anterior
          ? {
              ...anterior,
              estado: "Rechazado",
              fecha_rechazo:
                datos.presupuesto?.fecha_rechazo ?? null,
              motivo_rechazo: motivoRechazo.trim() || null,
            }
          : anterior
      );

      setMostrarRechazo(false);

      setMensaje("Presupuesto rechazado correctamente.");
    } catch (error) {
      console.error(error);

      setMensaje(
        error instanceof Error
          ? error.message
          : "Ha ocurrido un error al rechazar el presupuesto."
      );
    } finally {
      setProcesando(false);
    }
  }

  /* ==========================================================
     ESTADO DE CARGA
  ========================================================== */

  if (cargando) {
    return (
      <main style={{ padding: "40px" }}>
        <p>Cargando presupuesto...</p>
      </main>
    );
  }

  /* ==========================================================
     ERROR
  ========================================================== */

  if (error || !presupuesto) {
    return (
      <main style={{ padding: "40px" }}>
        <h1>Presupuesto no disponible</h1>

        <p>
          {error ||
            "No hemos podido encontrar el presupuesto solicitado."}
        </p>
      </main>
    );
  }

  /* ==========================================================
     CONTENIDO
  ========================================================== */

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f4f7f7",
        padding: "50px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "950px",
          margin: "0 auto",
          background: "#ffffff",
          borderRadius: "16px",
          padding: "40px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
        }}
      >
        {/* ==================================================
            EMPRESA
        ================================================== */}

        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "30px",
            borderBottom: "1px solid #e5e7eb",
            paddingBottom: "30px",
            marginBottom: "30px",
          }}
        >
          <div>
            <h2 style={{ margin: 0 }}>
              {presupuesto.empresa.nombre_comercial}
            </h2>

            <p>{presupuesto.empresa.razon_social}</p>

            <p>NIF: {presupuesto.empresa.nif}</p>
          </div>

          <div style={{ textAlign: "right" }}>
            <p>{presupuesto.empresa.email}</p>

            <p>{presupuesto.empresa.telefono}</p>

            <p>
              {presupuesto.empresa.localidad},{" "}
              {presupuesto.empresa.provincia}
            </p>
          </div>
        </header>

        {/* ==================================================
            CABECERA PRESUPUESTO
        ================================================== */}

        <section style={{ marginBottom: "35px" }}>
          <p
            style={{
              color: "#0f766e",
              fontWeight: 700,
              marginBottom: "5px",
            }}
          >
            PRESUPUESTO
          </p>

          <h1 style={{ marginTop: 0 }}>
            {presupuesto.numero}
          </h1>

          <p>
            Estado: <strong>{presupuesto.estado}</strong>
          </p>

          {caducado && (
            <p style={{ fontWeight: 700 }}>
              Este presupuesto ha caducado.
            </p>
          )}
        </section>

        {/* ==================================================
            CLIENTE
        ================================================== */}

        <section
          style={{
            background: "#f8fafc",
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "35px",
          }}
        >
          <p
            style={{
              marginTop: 0,
              fontWeight: 700,
            }}
          >
            Cliente
          </p>

          <h3>{presupuesto.cliente.nombre}</h3>

          <p>NIF: {presupuesto.cliente.nif}</p>

          <p>{presupuesto.cliente.email}</p>

          <p>
            {presupuesto.cliente.direccion},{" "}
            {presupuesto.cliente.localidad}
          </p>
        </section>

        {/* ==================================================
            PRODUCTOS
        ================================================== */}

        <section>
          <h2>Detalle del presupuesto</h2>

          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: "20px",
              }}
            >
              <thead>
                <tr
                  style={{
                    borderBottom: "2px solid #e5e7eb",
                    textAlign: "left",
                  }}
                >
                  <th style={{ padding: "14px" }}>
                    Descripción
                  </th>

                  <th style={{ padding: "14px" }}>
                    Cantidad
                  </th>

                  <th style={{ padding: "14px" }}>
                    Precio
                  </th>

                  <th style={{ padding: "14px" }}>
                    IVA
                  </th>

                  <th style={{ padding: "14px" }}>
                    Total
                  </th>
                </tr>
              </thead>

              <tbody>
                {presupuesto.lineas.map((linea) => (
                  <tr
                    key={linea.id}
                    style={{
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    <td style={{ padding: "14px" }}>
                      {linea.descripcion}
                    </td>

                    <td style={{ padding: "14px" }}>
                      {linea.cantidad}
                    </td>

                    <td style={{ padding: "14px" }}>
                      {Number(
                        linea.precio_unitario
                      ).toFixed(2)}{" "}
                      €
                    </td>

                    <td style={{ padding: "14px" }}>
                      {linea.porcentaje_iva} %
                    </td>

                    <td style={{ padding: "14px" }}>
                      {Number(linea.subtotal).toFixed(2)} €
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ==================================================
            TOTALES
        ================================================== */}

        <section
          style={{
            marginTop: "40px",
            marginLeft: "auto",
            maxWidth: "350px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "12px",
            }}
          >
            <span>Base imponible</span>

            <strong>
              {Number(
                presupuesto.base_imponible
              ).toFixed(2)}{" "}
              €
            </strong>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "15px",
            }}
          >
            <span>IVA</span>

            <strong>
              {Number(presupuesto.iva).toFixed(2)} €
            </strong>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              borderTop: "2px solid #e5e7eb",
              paddingTop: "18px",
              fontSize: "22px",
            }}
          >
            <strong>Total</strong>

            <strong>
              {Number(presupuesto.total).toFixed(2)} €
            </strong>
          </div>
        </section>

        {/* ==================================================
            MENSAJE DE RESULTADO
        ================================================== */}

        {mensaje && (
          <div
            style={{
              marginTop: "35px",
              padding: "16px 20px",
              background: "#f0fdfa",
              border: "1px solid #99f6e4",
              borderRadius: "10px",
              textAlign: "center",
              fontWeight: 700,
            }}
          >
            {mensaje}
          </div>
        )}

        {/* ==================================================
            ACCIONES
        ================================================== */}

        {presupuesto.estado === "Pendiente" && !caducado && (
          <section
            style={{
              marginTop: "50px",
              paddingTop: "30px",
              borderTop: "1px solid #e5e7eb",
            }}
          >
            {!mostrarRechazo ? (
              <div
                style={{
                  display: "flex",
                  gap: "15px",
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                {/* BOTÓN RECHAZAR */}

                <button
                  type="button"
                  disabled={procesando}
                  onClick={() => setMostrarRechazo(true)}
                  style={{
                    border: "1px solid #dc2626",
                    borderRadius: "10px",
                    padding: "14px 25px",
                    cursor: procesando
                      ? "not-allowed"
                      : "pointer",
                    fontWeight: 700,
                    background: "white",
                    color: "#dc2626",
                  }}
                >
                  Rechazar presupuesto
                </button>

                {/* BOTÓN ACEPTAR */}

                <button
                  type="button"
                  disabled={procesando}
                  onClick={aceptarPresupuesto}
                  style={{
                    border: "none",
                    borderRadius: "10px",
                    padding: "14px 25px",
                    cursor: procesando
                      ? "not-allowed"
                      : "pointer",
                    fontWeight: 700,
                    background: "#0f766e",
                    color: "white",
                  }}
                >
                  {procesando
                    ? "Procesando..."
                    : "Aceptar presupuesto"}
                </button>
              </div>
            ) : (
              /* ==================================================
                 FORMULARIO DE RECHAZO
              ================================================== */

              <div
                style={{
                  maxWidth: "550px",
                  margin: "0 auto",
                }}
              >
                <h3 style={{ marginTop: 0 }}>
                  Rechazar presupuesto
                </h3>

                <p>
                  Si quieres, indícanos el motivo del rechazo.
                </p>

                <textarea
                  value={motivoRechazo}
                  onChange={(e) =>
                    setMotivoRechazo(e.target.value)
                  }
                  maxLength={1000}
                  placeholder="Escribe aquí el motivo..."
                  style={{
                    width: "100%",
                    minHeight: "120px",
                    padding: "14px",
                    border: "1px solid #d1d5db",
                    borderRadius: "10px",
                    resize: "vertical",
                    fontFamily: "inherit",
                    fontSize: "15px",
                    boxSizing: "border-box",
                  }}
                />

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "12px",
                    marginTop: "15px",
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    type="button"
                    disabled={procesando}
                    onClick={() => {
                      setMostrarRechazo(false);
                      setMotivoRechazo("");
                    }}
                    style={{
                      padding: "12px 20px",
                      borderRadius: "10px",
                      border: "1px solid #d1d5db",
                      background: "white",
                      cursor: "pointer",
                      fontWeight: 700,
                    }}
                  >
                    Cancelar
                  </button>

                  <button
                    type="button"
                    disabled={procesando}
                    onClick={rechazarPresupuesto}
                    style={{
                      padding: "12px 20px",
                      borderRadius: "10px",
                      border: "none",
                      background: "#dc2626",
                      color: "white",
                      cursor: procesando
                        ? "not-allowed"
                        : "pointer",
                      fontWeight: 700,
                    }}
                  >
                    {procesando
                      ? "Procesando..."
                      : "Confirmar rechazo"}
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {/* ==================================================
            PRESUPUESTO ACEPTADO
        ================================================== */}

        {presupuesto.estado === "Aceptado" && (
          <section
            style={{
              marginTop: "40px",
              padding: "20px",
              background: "#f0fdfa",
              borderRadius: "12px",
              textAlign: "center",
            }}
          >
            <h3 style={{ color: "#0f766e", marginTop: 0 }}>
              Presupuesto aceptado
            </h3>

            <p style={{ marginBottom: 0 }}>
              Gracias. El presupuesto ha sido aceptado
              correctamente.
            </p>
          </section>
        )}

        {/* ==================================================
            PRESUPUESTO RECHAZADO
        ================================================== */}

        {presupuesto.estado === "Rechazado" && (
          <section
            style={{
              marginTop: "40px",
              padding: "20px",
              background: "#fef2f2",
              borderRadius: "12px",
              textAlign: "center",
            }}
          >
            <h3 style={{ color: "#dc2626", marginTop: 0 }}>
              Presupuesto rechazado
            </h3>

            <p style={{ marginBottom: 0 }}>
              El presupuesto ha sido rechazado correctamente.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}