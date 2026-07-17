import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 overflow-hidden flex flex-col min-h-screen">
        <header className="h-16 flex items-center border-b px-4 lg:px-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 sticky top-0 w-full gap-4">
          <SidebarTrigger />
          <div className="flex-1 flex justify-between items-center">
            <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
            <div className="flex items-center gap-4">
              {/* Top header items (user profile, theme toggle, notifications) will go here */}
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 bg-muted/20">
          {children}
        </div>
      </main>
    </SidebarProvider>
  )
}
