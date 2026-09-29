import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[#202729]">

      <Sidebar />

      <div className="ml-64">

        <Header />

        <main className="min-h-[calc(100vh-68px)] px-8 py-5">
          {children}
        </main>

      </div>

    </div>
  );
}