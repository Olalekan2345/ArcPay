'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Header from '@/components/dashboard/Header'
import CreateInvoiceModal from '@/components/invoices/CreateInvoiceModal'
import { useInvoices, type Invoice } from '@/hooks/useInvoices'
import { FileText, DollarSign, Clock, AlertTriangle, Plus, MoreHorizontal, Pencil, Trash2, Users } from 'lucide-react'

const statusColors: Record<string, string> = {
  paid: 'status-active',
  pending: 'status-pending',
  overdue: 'status-failed',
  draft: 'text-white/30 bg-white/[0.05]',
}

export default function InvoicesPage() {
  const { invoices, loading, isConnected, addInvoice, updateInvoice, deleteInvoice, totalInvoiced, totalPaid, totalPending, totalOverdue } = useInvoices()
  const [showModal, setShowModal] = useState(false)
  const [editInvoice, setEditInvoice] = useState<Invoice | null>(null)
  const [menuOpen, setMenuOpen] = useState<string | null>(null)

  if (!isConnected) {
    return (
      <div>
        <Header title="Invoices" subtitle="Create and manage client invoices in USDC" />
        <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="w-16 h-16 rounded-2xl glass border border-white/[0.08] flex items-center justify-center mx-auto mb-5">
            <FileText className="w-7 h-7 text-white/15" />
          </div>
          <div className="text-sm font-semibold text-white mb-2">Connect your wallet to manage invoices</div>
          <p className="text-xs text-white/40 max-w-xs">Invoice data is stored securely linked to your wallet address.</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Header
        title="Invoices"
        subtitle="Create and manage client invoices in USDC"
        action={{ label: 'New Invoice', onClick: () => setShowModal(true) }}
      />

      {showModal && (
        <CreateInvoiceModal
          onClose={() => setShowModal(false)}
          onSave={addInvoice}
        />
      )}

      {editInvoice && (
        <CreateInvoiceModal
          initial={editInvoice}
          onClose={() => setEditInvoice(null)}
          onSave={data => { updateInvoice(editInvoice.id, data); setEditInvoice(null) }}
        />
      )}

      <div className="p-8 space-y-6">
        {/* KPI cards */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Total Invoiced', value: `$${totalInvoiced.toLocaleString()}`, icon: FileText, color: 'text-white', bg: 'from-white/5 to-white/[0.02]' },
            { label: 'Paid', value: `$${totalPaid.toLocaleString()}`, icon: DollarSign, color: 'text-green-400', bg: 'from-green-500/10 to-green-500/5' },
            { label: 'Pending', value: `$${totalPending.toLocaleString()}`, icon: Clock, color: 'text-amber-400', bg: 'from-amber-500/10 to-amber-500/5' },
            { label: 'Overdue', value: `$${totalOverdue.toLocaleString()}`, icon: AlertTriangle, color: 'text-red-400', bg: 'from-red-500/10 to-red-500/5' },
          ].map(({ label, value, icon: Icon, color, bg }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className={`glass rounded-xl border border-white/[0.06] p-5 bg-gradient-to-b ${bg}`}
            >
              <Icon className={`w-5 h-5 ${color} mb-3`} />
              <div className="text-2xl font-bold text-white">{value}</div>
              <div className="text-xs text-white/40 mt-0.5">{label}</div>
            </motion.div>
          ))}
        </div>

        {/* Invoices table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl border border-white/[0.06] overflow-hidden"
        >
          <div className="grid grid-cols-12 gap-4 px-5 py-3.5 border-b border-white/[0.05] text-[10px] font-semibold text-white/30 uppercase tracking-widest">
            <div className="col-span-1">ID</div>
            <div className="col-span-3">Client</div>
            <div className="col-span-3">Description</div>
            <div className="col-span-1">Amount</div>
            <div className="col-span-2">Due Date</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-1"></div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-6 h-6 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
            </div>
          ) : invoices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
              <div className="w-16 h-16 rounded-2xl glass border border-white/[0.08] flex items-center justify-center mx-auto mb-5">
                <FileText className="w-7 h-7 text-white/15" />
              </div>
              <div className="text-sm font-semibold text-white mb-2">No invoices yet</div>
              <p className="text-xs text-white/40 max-w-xs mb-6">
                Create your first invoice to bill clients in USDC. Track payment status and manage outstanding amounts.
              </p>
              <button onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-bg-primary text-sm font-semibold text-white hover:opacity-90 transition-all shadow-glow-sm">
                <Plus className="w-4 h-4" />
                Create First Invoice
              </button>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {invoices.map((inv, i) => (
                <motion.div key={inv.id}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="grid grid-cols-12 gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors items-center group relative">
                  <div className="col-span-1">
                    <span className="text-[10px] font-mono text-white/40">{inv.invoiceNumber}</span>
                  </div>
                  <div className="col-span-3">
                    <div className="text-sm font-medium text-white truncate">{inv.client}</div>
                    <div className="text-xs text-white/40 truncate">{inv.clientEmail}</div>
                  </div>
                  <div className="col-span-3">
                    <div className="text-xs text-white/60 truncate">{inv.description}</div>
                  </div>
                  <div className="col-span-1">
                    <span className="text-sm font-semibold text-white">${inv.amount.toLocaleString()}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-xs text-white/50">{new Date(inv.dueDate).toLocaleDateString()}</span>
                  </div>
                  <div className="col-span-1">
                    <span className={`text-[10px] font-medium rounded-full px-2.5 py-1 capitalize ${statusColors[inv.status]}`}>
                      {inv.status}
                    </span>
                  </div>
                  <div className="col-span-1 flex justify-end relative">
                    <button
                      onClick={() => setMenuOpen(menuOpen === inv.id ? null : inv.id)}
                      className="w-7 h-7 rounded-lg glass border border-white/[0.08] opacity-0 group-hover:opacity-100 flex items-center justify-center text-white/40 hover:text-white transition-all">
                      <MoreHorizontal className="w-3.5 h-3.5" />
                    </button>
                    {menuOpen === inv.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(null)} />
                        <div className="absolute right-0 top-8 w-40 glass-strong rounded-xl border border-white/[0.08] shadow-card overflow-hidden z-20">
                          <button onClick={() => { setEditInvoice(inv); setMenuOpen(null) }}
                            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/[0.04] transition-colors text-left">
                            <Pencil className="w-3.5 h-3.5" /> Edit
                          </button>
                          {inv.status !== 'paid' && (
                            <button onClick={() => { updateInvoice(inv.id, { status: 'paid' }); setMenuOpen(null) }}
                              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-green-400 hover:bg-green-500/5 transition-colors text-left">
                              <DollarSign className="w-3.5 h-3.5" /> Mark Paid
                            </button>
                          )}
                          <button onClick={() => { deleteInvoice(inv.id); setMenuOpen(null) }}
                            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/5 transition-colors text-left">
                            <Trash2 className="w-3.5 h-3.5" /> Delete
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
      </div>
    </div>
  )
}
