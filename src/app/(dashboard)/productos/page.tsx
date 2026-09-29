"use client";

import {
  useEffect,
  useState,
} from "react";

import NewProductPanel, {
  NuevoProducto,
  Producto,
} from "@/components/productos/NewProductPanel";

import ProductDetailPanel from "@/components/productos/ProductDetailPanel";

/* ==========================================================
   PRODUCTO DEVUELTO POR LARAVEL
========================================================== */

type ProductoApi = {
  id: number;
  empresa_id: number;
  referencia: string;
  nombre: string;
  categoria: string | null;
  precio: string | number;
  stock: number;
  stock_minimo: number;
  activo: boolean;
};

/* ==========================================================
   ADAPTAR LARAVEL → NEXT.JS
========================================================== */

function adaptarProducto(
  producto: ProductoApi
): Producto {
  return {
    id: producto.id,
    referencia:
      producto.referencia,
    nombre:
      producto.nombre,
    categoria:
      producto.categoria ?? "",
    precio:
      Number(producto.precio),
    stock:
      producto.stock,
    stockMinimo:
      producto.stock_minimo,
    estado:
      producto.activo
        ? "Activo"
        : "Inactivo",
  };
}

/* ==========================================================
   PREPARAR NEXT.JS → LARAVEL
========================================================== */

function prepararProducto(
  producto: NuevoProducto
) {
  return {
    referencia:
      producto.referencia,
    nombre:
      producto.nombre,
    categoria:
      producto.categoria || null,
    precio:
      producto.precio,
    stock:
      producto.stock,
    stock_minimo:
      producto.stockMinimo,
    activo:
      producto.estado === "Activo",
  };
}

export default function ProductosPage() {
  const [productos, setProductos] =
    useState<Producto[]>([]);

  const [cargando, setCargando] =
    useState(true);

  const [busqueda, setBusqueda] =
    useState("");

  const [
    filtroEstado,
    setFiltroEstado,
  ] = useState("Todos");

  const [
    panelAbierto,
    setPanelAbierto,
  ] = useState(false);

  const [
    productoEditar,
    setProductoEditar,
  ] = useState<Producto | null>(null);

  const [
    productoSeleccionado,
    setProductoSeleccionado,
  ] = useState<Producto | null>(null);

  /* ==========================================================
     CARGAR PRODUCTOS - GET
  ========================================================== */

  useEffect(() => {
    async function cargarProductos() {
      try {
        const respuesta = await fetch(
          "http://127.0.0.1:8000/api/productos"
        );

        if (!respuesta.ok) {
          throw new Error(
            "No se pudieron cargar los productos."
          );
        }

        const datos: ProductoApi[] =
          await respuesta.json();

        setProductos(
          datos.map(adaptarProducto)
        );
      } catch (error) {
        console.error(
          "Error cargando productos:",
          error
        );
      } finally {
        setCargando(false);
      }
    }

    cargarProductos();
  }, []);

  /* ==========================================================
     FILTRAR PRODUCTOS
  ========================================================== */

  const productosFiltrados =
    productos.filter((producto) => {
      const texto =
        busqueda.toLowerCase();

      const coincideBusqueda =
        producto.nombre
          .toLowerCase()
          .includes(texto) ||
        producto.referencia
          .toLowerCase()
          .includes(texto) ||
        producto.categoria
          .toLowerCase()
          .includes(texto);

      const coincideEstado =
        filtroEstado === "Todos" ||
        producto.estado ===
          filtroEstado;

      return (
        coincideBusqueda &&
        coincideEstado
      );
    });

  /* ==========================================================
     ABRIR NUEVO PRODUCTO
  ========================================================== */

  function abrirNuevoProducto() {
    setProductoEditar(null);
    setPanelAbierto(true);
  }

  /* ==========================================================
     CREAR PRODUCTO - POST
  ========================================================== */

  async function guardarProducto(
    nuevoProducto: NuevoProducto
  ): Promise<boolean> {
    try {
      const respuesta = await fetch(
        "http://127.0.0.1:8000/api/productos",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
            Accept:
              "application/json",
          },

          body: JSON.stringify({
            empresa_id: 1,
            ...prepararProducto(
              nuevoProducto
            ),
          }),
        }
      );

      if (!respuesta.ok) {
        const error =
          await respuesta.json();

        console.error(
          "Error de Laravel al crear producto:",
          error
        );

        return false;
      }

      const productoCreado:
        ProductoApi =
        await respuesta.json();

      setProductos((actuales) =>
        [
          adaptarProducto(
            productoCreado
          ),
          ...actuales,
        ].sort((a, b) =>
          a.nombre.localeCompare(
            b.nombre
          )
        )
      );

      return true;
    } catch (error) {
      console.error(
        "Error creando producto:",
        error
      );

      return false;
    }
  }

  /* ==========================================================
     ABRIR EDICIÓN
  ========================================================== */

  function editarProducto(
    producto: Producto
  ) {
    setProductoEditar(producto);
    setPanelAbierto(true);
  }

  /* ==========================================================
     ACTUALIZAR PRODUCTO - PATCH
  ========================================================== */

  async function actualizarProducto(
    productoActualizado: Producto
  ): Promise<boolean> {
    try {
      const {
        id,
        ...datosProducto
      } = productoActualizado;

      const respuesta = await fetch(
        `http://127.0.0.1:8000/api/productos/${id}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",
            Accept:
              "application/json",
          },

          body: JSON.stringify(
            prepararProducto(
              datosProducto
            )
          ),
        }
      );

      if (!respuesta.ok) {
        const error =
          await respuesta.json();

        console.error(
          "Error de Laravel al actualizar producto:",
          error
        );

        return false;
      }

      const productoGuardado:
        ProductoApi =
        await respuesta.json();

      const productoAdaptado =
        adaptarProducto(
          productoGuardado
        );

      setProductos((actuales) =>
        actuales
          .map((producto) =>
            producto.id === id
              ? productoAdaptado
              : producto
          )
          .sort((a, b) =>
            a.nombre.localeCompare(
              b.nombre
            )
          )
      );

      setProductoSeleccionado(
        (actual) =>
          actual?.id === id
            ? productoAdaptado
            : actual
      );

      return true;
    } catch (error) {
      console.error(
        "Error actualizando producto:",
        error
      );

      return false;
    }
  }

  /* ==========================================================
     ELIMINAR PRODUCTO - DELETE
  ========================================================== */

  async function eliminarProducto(
    id: number
  ) {
    const confirmado =
      window.confirm(
        "¿Seguro que quieres eliminar este producto?"
      );

    if (!confirmado) return;

    try {
      const respuesta = await fetch(
        `http://127.0.0.1:8000/api/productos/${id}`,
        {
          method: "DELETE",

          headers: {
            Accept:
              "application/json",
          },
        }
      );

      if (!respuesta.ok) {
        const error =
          await respuesta.json();

        console.error(
          "Error de Laravel al eliminar producto:",
          error
        );

        window.alert(
          "No se ha podido eliminar el producto."
        );

        return;
      }

      setProductos((actuales) =>
        actuales.filter(
          (producto) =>
            producto.id !== id
        )
      );

      if (
        productoSeleccionado?.id ===
        id
      ) {
        setProductoSeleccionado(
          null
        );
      }
    } catch (error) {
      console.error(
        "Error eliminando producto:",
        error
      );

      window.alert(
        "No se ha podido conectar con el servidor."
      );
    }
  }

  return (
    <>
      {/* ======================================================
          CABECERA
      ====================================================== */}

      <section className="flex items-end justify-between">

        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.14em] text-[#5EEAD4]">
            Catálogo
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-white">
            Productos
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Gestiona tu catálogo de productos, precios y existencias.
          </p>
        </div>

        <button
          onClick={
            abrirNuevoProducto
          }
          className="rounded-xl bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#115E59]"
        >
          + Nuevo producto
        </button>

      </section>

      {/* ======================================================
          TABLA
      ====================================================== */}

      <section className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[#E8ECEC] shadow-xl shadow-black/10">

        {/* BUSCADOR Y FILTRO */}

        <div className="flex items-center justify-between gap-4 border-b border-slate-300 p-5">

          <div className="relative w-full max-w-sm">

            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              ⌕
            </span>

            <input
              value={busqueda}
              onChange={(event) =>
                setBusqueda(
                  event.target.value
                )
              }
              placeholder="Buscar producto, referencia..."
              className="h-10 w-full rounded-xl border border-slate-300 bg-[#F5F7F7] pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-[#0F766E]"
            />

          </div>

          <select
            value={filtroEstado}
            onChange={(event) =>
              setFiltroEstado(
                event.target.value
              )
            }
            className="rounded-xl border border-slate-300 bg-[#F5F7F7] px-4 py-2.5 text-sm font-medium text-slate-600 outline-none focus:border-[#0F766E]"
          >
            <option value="Todos">
              Todos los estados
            </option>

            <option value="Activo">
              Activos
            </option>

            <option value="Inactivo">
              Inactivos
            </option>
          </select>

        </div>

        {/* TABLA */}

        <div className="overflow-x-auto">

          {cargando ? (
            <div className="p-8 text-center text-sm text-slate-500">
              Cargando productos...
            </div>
          ) : (
            <table className="w-full">

              <thead>

                <tr className="border-b border-slate-300 bg-[#DDE2E2] text-left">

                  {[
                    "Producto",
                    "Referencia",
                    "Categoría",
                    "Precio",
                    "Stock",
                    "Estado",
                    "Acciones",
                  ].map((titulo) => (
                    <th
                      key={titulo}
                      className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 last:text-right"
                    >
                      {titulo}
                    </th>
                  ))}

                </tr>

              </thead>

              <tbody>

                {productosFiltrados.map(
                  (producto) => {
                    const stockBajo =
                      producto.stock <=
                      producto.stockMinimo;

                    return (
                      <tr
                        key={producto.id}
                        className="border-b border-slate-300/70 transition last:border-0 hover:bg-[#F5F7F7]"
                      >

                        {/* PRODUCTO */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-3">

                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#BFEDE7] text-xs font-bold text-[#0F766E]">
                              {producto.nombre.charAt(
                                0
                              )}
                            </div>

                            <span className="text-sm font-semibold text-[#1C2526]">
                              {producto.nombre}
                            </span>

                          </div>

                        </td>

                        {/* REFERENCIA */}

                        <td className="px-5 py-4 text-sm font-medium text-slate-600">
                          {
                            producto.referencia
                          }
                        </td>

                        {/* CATEGORÍA */}

                        <td className="px-5 py-4 text-sm text-slate-600">
                          {producto.categoria ||
                            "—"}
                        </td>

                        {/* PRECIO */}

                        <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                          {producto.precio.toLocaleString(
                            "es-ES",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}{" "}
                          €
                        </td>

                        {/* STOCK */}

                        <td className="px-5 py-4">

                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                              stockBajo
                                ? "bg-red-100 text-red-700"
                                : "bg-emerald-100 text-emerald-700"
                            }`}
                          >
                            {producto.stock}{" "}
                            uds.
                          </span>

                        </td>

                        {/* ESTADO */}

                        <td className="px-5 py-4">

                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                              producto.estado ===
                              "Activo"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-slate-200 text-slate-600"
                            }`}
                          >
                            {
                              producto.estado
                            }
                          </span>

                        </td>

                        {/* ACCIONES */}

                        <td className="px-5 py-4 text-right">

                          <button
                            onClick={() =>
                              setProductoSeleccionado(
                                producto
                              )
                            }
                            className="rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-500 transition hover:bg-slate-200 hover:text-[#0F766E]"
                          >
                            Ver
                          </button>

                          <button
                            onClick={() =>
                              editarProducto(
                                producto
                              )
                            }
                            className="rounded-lg px-3 py-1.5 text-sm font-semibold text-[#0F766E] transition hover:bg-[#BFEDE7]"
                          >
                            Editar
                          </button>

                          <button
                            onClick={() =>
                              eliminarProducto(
                                producto.id
                              )
                            }
                            className="ml-1 rounded-lg px-3 py-1.5 text-sm font-semibold text-red-500 transition hover:bg-red-50"
                          >
                            Eliminar
                          </button>

                        </td>

                      </tr>
                    );
                  }
                )}

                {productosFiltrados.length ===
                  0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-10 text-center text-sm text-slate-500"
                    >
                      No hay productos para mostrar.
                    </td>
                  </tr>
                )}

              </tbody>

            </table>
          )}

        </div>

        {/* PIE */}

        <div className="flex items-center justify-between border-t border-slate-300 px-5 py-4">

          <p className="text-xs text-slate-500">
            Mostrando{" "}
            {productosFiltrados.length}{" "}
            de {productos.length}{" "}
            productos
          </p>

          <p className="text-xs text-slate-500">
            Stock bajo marcado en rojo
          </p>

        </div>

      </section>

      {/* ======================================================
          VER PRODUCTO
      ====================================================== */}

      <ProductDetailPanel
        producto={
          productoSeleccionado
        }
        cerrar={() =>
          setProductoSeleccionado(
            null
          )
        }
        editar={(producto) => {
          setProductoSeleccionado(
            null
          );

          editarProducto(
            producto
          );
        }}
      />

      {/* ======================================================
          CREAR / EDITAR
      ====================================================== */}

      {panelAbierto && (
        <NewProductPanel
          key={
            productoEditar?.id ??
            "nuevo"
          }
          cerrar={() => {
            setPanelAbierto(false);
            setProductoEditar(null);
          }}
          guardar={
            guardarProducto
          }
          productoEditar={
            productoEditar
          }
          actualizar={
            actualizarProducto
          }
        />
      )}

    </>
  );
}