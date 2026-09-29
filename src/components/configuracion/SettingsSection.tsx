import type { ReactNode } from "react";

type Props = {
  titulo: string;
  descripcion: string;
  children: ReactNode;
};

export default function SettingsSection({
  titulo,
  descripcion,
  children,
}: Props) {
  return (
    <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#E8ECEC] shadow-xl shadow-black/10">

      {/* CABECERA */}

      <div className="border-b border-slate-300 bg-[#DDE2E2] px-6 py-5">

        <h2 className="text-lg font-bold text-[#1C2526]">
          {titulo}
        </h2>

        <p className="mt-1 text-xs text-slate-500">
          {descripcion}
        </p>

      </div>

      {/* CONTENIDO */}

      <div className="p-6">
        {children}
      </div>

    </section>
  );
}