import Sidebar from '@/components/dashboard/Sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-surface-50 text-slate-900">
      <Sidebar />
      <div className="ml-60 min-h-screen">
        {children}
      </div>
    </div>
  )
}
