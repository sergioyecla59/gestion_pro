import ReportsChart from "@/components/informes/ReportsChart";

const datosMensuales = [
  {
    mes: "Abr",
    ingresos: 16400,
    gastos: 9800,
  },
  {
    mes: "May",
    ingresos: 19200,
    gastos: 11200,
  },
  {
    mes: "Jun",
    ingresos: 18100,
    gastos: 10500,
  },
  {
    mes: "Jul",
    ingresos: 22300,
    gastos: 12800,
  },
  {
    mes: "Ago",
    ingresos: 20700,
    gastos: 11900,
  },
  {
    mes: "Sep",
    ingresos: 24580,
    gastos: 13840,
  },
];

const gastosCategorias = [
  {
    categoria: "Compras",
    importe: 8230,
  },
  {
    categoria: "Personal",
    importe: 2900,
  },
  {
    categoria: "Transporte",
    importe: 1180,
  },
  {
    categoria: "Suministros",
    importe: 930,
  },
  {
    categoria: "Otros",
    importe: 600,
  },
];

export default function InformesPage() {
  const ingresos = 24580;
  const gastos = 13840;

  const beneficio =
    ingresos - gastos;

  const margen =
    ingresos > 0
      ? (beneficio / ingresos) * 100
      : 0;

  return (
    <>
      {/* CABECERA */}

      <section className="flex items-end justify-between">

        <div>

          <p className="mb-1 text-xs font-bold uppercase tracking-[0.14em] text-[#5EEAD4]">
            Análisis
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-white">
            Informes
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Analiza el rendimiento económico de tu empresa.
          </p>

        </div>

        <select className="rounded-xl border border-white/10 bg-[#E8ECEC] px-4 py-2.5 text-sm font-semibold text-slate-600 outline-none">

          <option>
            Septiembre 2026
          </option>

          <option>
            Agosto 2026
          </option>

          <option>
            Julio 2026
          </option>

        </select>

      </section>

      {/* INDICADORES */}

      <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

        <Tarjeta
          titulo="Ingresos"
          valor={formatearDinero(
            ingresos
          )}
          descripcion="Facturación del periodo"
        />

        <Tarjeta
          titulo="Gastos"
          valor={formatearDinero(
            gastos
          )}
          descripcion="Gastos del periodo"
        />

        <Tarjeta
          titulo="Beneficio"
          valor={formatearDinero(
            beneficio
          )}
          descripcion="Ingresos - gastos"
          destacado
        />

        <Tarjeta
          titulo="Margen"
          valor={`${margen.toFixed(
            1
          )} %`}
          descripcion="Margen sobre ingresos"
        />

      </section>

      {/* GRÁFICAS */}

      <section className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[2fr_1fr]">

        <ReportsChart
          datos={datosMensuales}
        />

        {/* GASTOS POR CATEGORÍA */}

        <div className="rounded-2xl border border-white/10 bg-[#E8ECEC] p-6">

          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0F766E]">
            Gastos
          </p>

          <h2 className="mt-1 text-lg font-bold text-[#1C2526]">
            Por categoría
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Distribución de gastos del periodo.
          </p>

          <div className="mt-6 space-y-5">

            {gastosCategorias.map(
              (gasto) => {

                const porcentaje =
                  (gasto.importe /
                    gastos) *
                  100;

                return (
                  <div
                    key={
                      gasto.categoria
                    }
                  >

                    <div className="mb-2 flex items-center justify-between">

                      <span className="text-sm font-semibold text-slate-600">
                        {
                          gasto.categoria
                        }
                      </span>

                      <span className="text-sm font-bold text-[#1C2526]">
                        {formatearDinero(
                          gasto.importe
                        )}
                      </span>

                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-300">

                      <div
                        className="h-full rounded-full bg-[#0F766E]"
                        style={{
                          width: `${Math.min(
                            porcentaje,
                            100
                          )}%`,
                        }}
                      />

                    </div>

                  </div>
                );
              }
            )}

          </div>

        </div>

      </section>

      {/* RESUMEN */}

      <section className="mt-5 rounded-2xl border border-white/10 bg-[#E8ECEC] p-6">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0F766E]">
              Resultado
            </p>

            <h2 className="mt-1 text-lg font-bold text-[#1C2526]">
              Resumen del periodo
            </h2>

          </div>

          <p className="text-2xl font-bold text-[#0F766E]">
            +{" "}
            {formatearDinero(
              beneficio
            )}
          </p>

        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">

          <Dato
            titulo="Ingresos"
            valor={ingresos}
          />

          <Dato
            titulo="Gastos"
            valor={gastos}
          />

          <Dato
            titulo="Resultado"
            valor={beneficio}
          />

        </div>

      </section>
    </>
  );
}

/* ==========================================================
   COMPONENTES AUXILIARES
========================================================== */

function Tarjeta({
  titulo,
  valor,
  descripcion,
  destacado = false,
}: {
  titulo: string;
  valor: string;
  descripcion: string;
  destacado?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        destacado
          ? "border-[#2DD4BF]/30 bg-[#0F766E]"
          : "border-white/10 bg-[#E8ECEC]"
      }`}
    >

      <p
        className={`text-xs font-semibold uppercase tracking-wider ${
          destacado
            ? "text-[#99F6E4]"
            : "text-slate-500"
        }`}
      >
        {titulo}
      </p>

      <p
        className={`mt-2 text-2xl font-bold ${
          destacado
            ? "text-white"
            : "text-[#1C2526]"
        }`}
      >
        {valor}
      </p>

      <p
        className={`mt-1 text-xs ${
          destacado
            ? "text-teal-100"
            : "text-slate-400"
        }`}
      >
        {descripcion}
      </p>

    </div>
  );
}

function Dato({
  titulo,
  valor,
}: {
  titulo: string;
  valor: number;
}) {
  return (
    <div className="rounded-xl bg-[#F5F7F7] p-4">

      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        {titulo}
      </p>

      <p className="mt-1 text-lg font-bold text-[#1C2526]">
        {formatearDinero(
          valor
        )}
      </p>

    </div>
  );
}

function formatearDinero(
  cantidad: number
) {
  return `${cantidad.toLocaleString(
    "es-ES",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  )} €`;
}