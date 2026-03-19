import Sidebar from "@/components/Sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg p-2">
      <div className="flex min-h-[calc(100vh-1rem)] h-[calc(100vh-1rem)] rounded-xl  bg-bg">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
