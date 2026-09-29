import StatCard from "@/components/dashboard/StatCard";
import QuickActions from "@/components/dashboard/QuickActions";
import SalesChart from "@/components/dashboard/SalesChart";

export default function DashboardPage() {
  return (
    <>

      {/* CABECERA */}
      <section className="mb-5 flex items-end justify-between">

        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.14em] text-[#5EEAD4]">
            Resumen general
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-white">
            Buenos días, Sergio
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Aquí tienes un resumen de la actividad de tu empresa.
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs font-medium text-slate-500">
            Última actualización
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-300">
            Hoy, 13:50
          </p>
        </div>

      </section>


      {/* ESTADÍSTICAS */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

        <StatCard
          titulo="Ventas del mes"
          valor="24.580 €"
          detalle="Facturación acumulada"
          tendencia="+12,5%"
        />

        <StatCard
          titulo="Pedidos activos"
          valor="38"
          detalle="8 pendientes de preparar"
          tendencia="+4"
        />

        <StatCard
          titulo="Pendiente de cobro"
          valor="4.320 €"
          detalle="7 facturas pendientes"
        />

        <StatCard
          titulo="Clientes"
          valor="126"
          detalle="6 nuevos este mes"
          tendencia="+6"
        />

      </section>


      {/* ZONA INFERIOR */}
      <section className="mt-4 grid grid-cols-1 items-stretch gap-5 xl:grid-cols-[2.3fr_1fr]">

        <SalesChart />

        <QuickActions />

      </section>

    </>
  );
}