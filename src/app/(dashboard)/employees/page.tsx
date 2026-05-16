'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Header from '@/components/dashboard/Header'
import AddEmployeeModal from '@/components/employees/AddEmployeeModal'
import { useEmployees, type Employee } from '@/hooks/useEmployees'
import { useConfidential } from '@/contexts/ConfidentialContext'
import { Search, Shield, Download, UserPlus, MapPin, MoreHorizontal, Users, Trash2, Pencil, Eye, EyeOff, Loader2 } from 'lucide-react'

const statusColors: Record<string, string> = {
  active: 'status-active',
  pending: 'status-pending',
  inactive: 'status-failed',
}

export default function EmployeesPage() {
  const { employees, loading, isConnected, addEmployee, updateEmployee, deleteEmployee, totalMonthlyPayroll, avgSalary, departments } = useEmployees()
  const { revealed, revealing, reveal, conceal, mask } = useConfidential()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null)
  const [menuOpen, setMenuOpen] = useState<string | null>(null)

  const filtered = employees.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.role.toLowerCase().includes(search.toLowerCase()) ||
      e.department.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'All' || e.status === filter.toLowerCase()
    return matchSearch && matchFilter
  })

  const handleExport = () => {
    if (!employees.length) return
    const csv = [
      'Name,Email,Role,Department,Salary (USDC),Wallet,Location,Status,Schedule',
      ...employees.map(e => `${e.name},${e.email},${e.role},${e.department},${revealed ? e.salary : '[CONFIDENTIAL]'},${e.wallet},${e.location},${e.status},${e.schedule}`)
    ].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'arcpay-employees.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  if (!isConnected) {
    return (
      <div>
        <Header title="Employees" subtitle="Manage your global team and USDC salary assignments" />
        <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="w-16 h-16 rounded-2xl glass border border-slate-200 flex items-center justify-center mx-auto mb-5">
            <Users className="w-7 h-7 text-slate-300" />
          </div>
          <div className="text-sm font-semibold text-slate-900 mb-2">Connect your wallet to manage employees</div>
          <p className="text-xs text-slate-400 max-w-xs">Employee data is stored securely linked to your wallet address.</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Header
        title="Employees"
        subtitle="Manage your global team and USDC salary assignments"
        action={{ label: 'Add Employee', onClick: () => setShowModal(true) }}
      />

      {showModal && (
        <AddEmployeeModal
          onClose={() => setShowModal(false)}
          onSave={addEmployee}
        />
      )}

      {editEmployee && (
        <AddEmployeeModal
          initial={editEmployee}
          onClose={() => setEditEmployee(null)}
          onSave={data => { updateEmployee(editEmployee.id, data); setEditEmployee(null) }}
        />
      )}

      <div className="p-8">
        {/* Toolbar */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search employees..."
              className="w-full bg-surface-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-300 outline-none focus:border-brand-400 transition-all" />
          </div>
          <div className="flex items-center gap-3">
            {/* Arcium MPC reveal button */}
            <button
              onClick={revealed ? conceal : reveal}
              disabled={revealing || !isConnected}
              title={revealed ? 'Conceal salary data' : 'Sign to reveal salary data (Arcium MPC)'}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-xs font-medium transition-all disabled:opacity-50 ${
                revealed
                  ? 'bg-brand-50 border-brand-400 text-brand-600 hover:bg-brand-100'
                  : 'glass border-brand-200 text-brand-600 hover:border-brand-400'
              }`}
            >
              {revealing
                ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Authorizing...</>
                : revealed
                  ? <><EyeOff className="w-3.5 h-3.5" /> Conceal</>
                  : <><Eye className="w-3.5 h-3.5" /> Reveal Salaries</>
              }
            </button>
            {['All', 'Active', 'Pending'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${filter === f ? 'gradient-bg-primary text-white shadow-glow-sm' : 'glass border border-slate-200 text-slate-500 hover:text-slate-900'}`}>
                {f}
              </button>
            ))}
            <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 rounded-lg glass border border-slate-200 text-xs text-slate-500 hover:text-slate-900 transition-all">
              <Download className="w-3.5 h-3.5" />
              Export
            </button>
          </div>
        </motion.div>

        {/* Arcium MPC confidentiality notice */}
        {!revealed && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl glass border border-brand-200 bg-brand-50 mb-4">
            <Shield className="w-4 h-4 text-brand-600 flex-shrink-0" />
            <div className="text-xs text-brand-600 leading-relaxed">
              <span className="font-semibold">Salaries sealed by Arcium MPC.</span>{' '}
              Salary amounts are encrypted and hidden. Sign a wallet authorization above to reveal them — no transaction is sent.
            </div>
          </div>
        )}

        {/* Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass rounded-2xl border border-slate-100 overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-5 py-3.5 border-b border-slate-100 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
            <div className="col-span-4">Employee</div>
            <div className="col-span-2">Department</div>
            <div className="col-span-2">Salary (USDC)</div>
            <div className="col-span-2">Location</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-1"></div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-6 h-6 border-2 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
              <div className="w-16 h-16 rounded-2xl glass border border-slate-200 flex items-center justify-center mx-auto mb-5">
                <Users className="w-7 h-7 text-slate-300" />
              </div>
              <div className="text-sm font-semibold text-slate-900 mb-2">
                {employees.length === 0 ? 'No employees yet' : 'No results found'}
              </div>
              <p className="text-xs text-slate-400 max-w-xs mb-6">
                {employees.length === 0
                  ? 'Add your first team member to begin assigning USDC salaries and running confidential payroll.'
                  : 'Try adjusting your search or filter.'}
              </p>
              {employees.length === 0 && (
                <button onClick={() => setShowModal(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-bg-primary text-sm font-semibold text-white hover:opacity-90 transition-all shadow-glow-sm">
                  <UserPlus className="w-4 h-4" />
                  Add First Employee
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filtered.map((emp, i) => (
                <motion.div key={emp.id}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="grid grid-cols-12 gap-4 px-5 py-4 hover:bg-surface-50 transition-colors items-center group relative">
                  <div className="col-span-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full gradient-bg-primary flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                      {emp.avatar}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-900">{emp.name}</div>
                      <div className="text-xs text-slate-400">{emp.role}</div>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <span className="text-xs text-slate-500 bg-surface-100 rounded-md px-2 py-1">{emp.department}</span>
                  </div>
                  <div className="col-span-2">
                    <div className="flex items-center gap-1">
                      <Shield className="w-3 h-3 text-brand-600" />
                      <span className={`text-sm font-medium ${revealed ? 'text-slate-900' : 'text-brand-600 tracking-widest'}`}>
                        {mask(emp.salary)}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400">{emp.schedule}</div>
                  </div>
                  <div className="col-span-2 flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                    <span className="text-xs text-slate-500 truncate">{emp.location || '—'}</span>
                  </div>
                  <div className="col-span-1">
                    <span className={`text-[10px] font-medium rounded-full px-2.5 py-1 capitalize ${statusColors[emp.status]}`}>
                      {emp.status}
                    </span>
                  </div>
                  <div className="col-span-1 flex justify-end relative">
                    <button
                      onClick={() => setMenuOpen(menuOpen === emp.id ? null : emp.id)}
                      className="w-7 h-7 rounded-lg glass border border-slate-200 opacity-0 group-hover:opacity-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all">
                      <MoreHorizontal className="w-3.5 h-3.5" />
                    </button>
                    {menuOpen === emp.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(null)} />
                        <div className="absolute right-0 top-8 w-36 glass-strong rounded-xl border border-slate-200 shadow-card overflow-hidden z-20">
                          <button onClick={() => { setEditEmployee(emp); setMenuOpen(null) }}
                            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-slate-500 hover:text-slate-900 hover:bg-surface-50 transition-colors text-left">
                            <Pencil className="w-3.5 h-3.5" /> Edit
                          </button>
                          <button onClick={() => { deleteEmployee(emp.id); setMenuOpen(null) }}
                            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors text-left">
                            <Trash2 className="w-3.5 h-3.5" /> Remove
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          {[
            { label: 'Total Monthly Payroll', value: employees.length > 0 ? mask(totalMonthlyPayroll) : '$0', sub: 'USDC / month' },
            { label: 'Average Salary', value: employees.length > 0 ? mask(avgSalary) : '—', sub: 'Per employee' },
            { label: 'Departments', value: `${departments}`, sub: 'Active teams' },
          ].map(({ label, value, sub }) => (
            <div key={label} className="glass rounded-xl border border-slate-100 p-4">
              <div className="text-xs text-slate-400 mb-1">{label}</div>
              <div className="text-xl font-bold text-slate-900">{value}</div>
              <div className="text-[10px] text-slate-400">{sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
