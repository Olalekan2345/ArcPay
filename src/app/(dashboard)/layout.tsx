import Sidebar from '@/components/dashboard/Sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#07080f] text-white">
      <Sidebar />
      <div className="ml-60 min-h-screen">
        {children}
      </div>
    </div>
  )
}
