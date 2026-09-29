type Mes = {
  mes: string;
  ingresos: number;
  gastos: number;
};

type Props = {
  datos: Mes[];
};

export default function ReportsChart({
  datos,
}: Props) {
  const maximo = Math.max(
    ...datos.flatMap((dato) => [
      dato.ingresos,
      dato.gastos,
    ])
  );

  const puntosIngresos = datos
    .map((dato, index) => {
      const x =
        (index / (datos.length - 1)) * 100;

      const y =
        100 -
        (dato.ingresos / maximo) * 80;

      return `${x},${y}`;
    })
    .join(" ");

  const puntosGastos = datos
    .map((dato, index) => {
      const x =
        (index / (datos.length - 1)) * 100;

      const y =
        100 -
        (dato.gastos / maximo) * 80;

      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="rounded-2xl border border-white/10 bg-[#E8ECEC] p-6">

      <div className="flex items-start justify-between">

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0F766E]">
            Evolución
          </p>

          <h2 className="mt-1 text-lg font-bold text-[#1C2526]">
            Ingresos y gastos
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Comparativa de los últimos meses.
          </p>
        </div>

        <div className="flex gap-4 text-xs">

          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#0F766E]" />
            <span className="text-slate-500">
              Ingresos
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-400" />
            <span className="text-slate-500">
              Gastos
            </span>
          </div>

        </div>

      </div>

      {/* GRÁFICA */}

      <div className="mt-7 h-64">

        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="h-full w-full overflow-visible"
        >

          {/* LÍNEAS HORIZONTALES */}

          {[20, 40, 60, 80].map(
            (linea) => (
              <line
                key={linea}
                x1="0"
                x2="100"
                y1={linea}
                y2={linea}
                stroke="#CBD5E1"
                strokeWidth="0.3"
              />
            )
          )}

          {/* GASTOS */}

          <polyline
            points={puntosGastos}
            fill="none"
            stroke="#94A3B8"
            strokeWidth="1.4"
            vectorEffect="non-scaling-stroke"
          />

          {/* INGRESOS */}

          <polyline
            points={puntosIngresos}
            fill="none"
            stroke="#0F766E"
            strokeWidth="1.8"
            vectorEffect="non-scaling-stroke"
          />

        </svg>

      </div>

      {/* MESES */}

      <div className="mt-2 grid grid-cols-6">

        {datos.map((dato) => (
          <p
            key={dato.mes}
            className="text-center text-xs font-medium text-slate-400"
          >
            {dato.mes}
          </p>
        ))}

      </div>

    </div>
  );
}