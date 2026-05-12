'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Briefcase, Building2, MapPin, DollarSign, FileText } from 'lucide-react'
import type { Job } from '@/hooks/useJobs'

const DEPARTMENTS = ['Engineering', 'Product', 'Design', 'Marketing', 'Sales', 'Finance', 'HR', 'Operations', 'Legal', 'Other']
const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship'] as const
const STATUSES = ['open', 'draft', 'closed'] as const

interface Props {
  onClose: () => void
  onSave: (data: Omit<Job, 'id' | 'postedAt' | 'applicants'>) => void
  initial?: Job
}

export default function PostJobModal({ onClose, onSave, initial }: Props) {
  const [form, setForm] = useState({
    title: initial?.title ?? '',
    department: initial?.department ?? '',
    location: initial?.location ?? '',
    type: initial?.type ?? 'Full-time' as const,
    salaryMin: initial?.salaryMin?.toString() ?? '',
    salaryMax: initial?.salaryMax?.toString() ?? '',
    description: initial?.description ?? '',
    status: initial?.status ?? 'open' as const,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  const set = (k: string, v: string) => {
    setForm(f => ({ ...f, [k]: v }))
    setErrors(e => ({ ...e, [k]: '' }))
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.title.trim()) e.title = 'Job title is required'
    if (!form.department) e.department = 'Department is required'
    if (!form.location.trim()) e.location = 'Location is required'
    if (form.salaryMin && (isNaN(Number(form.salaryMin)) || Number(form.salaryMin) < 0)) e.salaryMin = 'Invalid amount'
    if (form.salaryMax && (isNaN(Number(form.salaryMax)) || Number(form.salaryMax) < 0)) e.salaryMax = 'Invalid amount'
    return e
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSaving(true)
    await new Promise(r => setTimeout(r, 300))
    onSave({
      title: form.title.trim(),
      department: form.department,
      location: form.location.trim(),
      type: form.type,
      salaryMin: Number(form.salaryMin) || 0,
      salaryMax: Number(form.salaryMax) || 0,
      description: form.description.trim(),
      status: form.status,
    })
    setSaving(false)
    onClose()
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          onClick={e => e.stopPropagation()}
          className="relative w-full max-w-lg glass-strong rounded-2xl border border-white/[0.1] shadow-[0_0_80px_rgba(99,102,241,0.12)] overflow-hidden max-h-[90vh] flex flex-col"
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.07] flex-shrink-0">
            <div>
              <h2 className="text-base font-semibold text-white">{initial ? 'Edit Job' : 'Post a Job'}</h2>
              <p className="text-xs text-white/40 mt-0.5">Add a new position to your hiring pipeline</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-lg glass border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="overflow-y-auto flex-1">
            <div className="p-6 space-y-4">

              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">Job Title *</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                  <input value={form.title} onChange={e => set('title', e.target.value)}
                    placeholder="Senior Software Engineer"
                    className={`w-full bg-white/[0.04] border rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-white/20 outline-none transition-all ${errors.title ? 'border-red-500/50' : 'border-white/[0.08] focus:border-indigo-500/50'}`} />
                </div>
                {errors.title && <p className="text-[11px] text-red-400 mt-1">{errors.title}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1.5">Department *</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                    <select value={form.department} onChange={e => set('department', e.target.value)}
                      className={`w-full bg-white/[0.04] border rounded-xl pl-9 pr-3 py-2.5 text-sm text-white outline-none transition-all appearance-none ${errors.department ? 'border-red-500/50' : 'border-white/[0.08] focus:border-indigo-500/50'}`}>
                      <option value="" className="bg-[#0d0e1a]">Select department</option>
                      {DEPARTMENTS.map(d => <option key={d} value={d} className="bg-[#0d0e1a]">{d}</option>)}
                    </select>
                  </div>
                  {errors.department && <p className="text-[11px] text-red-400 mt-1">{errors.department}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1.5">Employment Type</label>
                  <select value={form.type} onChange={e => set('type', e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-indigo-500/50 transition-all appearance-none">
                    {JOB_TYPES.map(t => <option key={t} value={t} className="bg-[#0d0e1a]">{t}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">Location *</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                  <input value={form.location} onChange={e => set('location', e.target.value)}
                    placeholder="Remote / Lagos, Nigeria / San Francisco, US"
                    className={`w-full bg-white/[0.04] border rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-white/20 outline-none transition-all ${errors.location ? 'border-red-500/50' : 'border-white/[0.08] focus:border-indigo-500/50'}`} />
                </div>
                {errors.location && <p className="text-[11px] text-red-400 mt-1">{errors.location}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1.5">Min Salary (USDC/mo)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                    <input value={form.salaryMin} onChange={e => set('salaryMin', e.target.value)}
                      placeholder="3000" type="number" min="0"
                      className={`w-full bg-white/[0.04] border rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-white/20 outline-none transition-all ${errors.salaryMin ? 'border-red-500/50' : 'border-white/[0.08] focus:border-indigo-500/50'}`} />
                  </div>
                  {errors.salaryMin && <p className="text-[11px] text-red-400 mt-1">{errors.salaryMin}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1.5">Max Salary (USDC/mo)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                    <input value={form.salaryMax} onChange={e => set('salaryMax', e.target.value)}
                      placeholder="6000" type="number" min="0"
                      className={`w-full bg-white/[0.04] border rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-white/20 outline-none transition-all ${errors.salaryMax ? 'border-red-500/50' : 'border-white/[0.08] focus:border-indigo-500/50'}`} />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">Job Description</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-3.5 h-3.5 text-white/30" />
                  <textarea value={form.description} onChange={e => set('description', e.target.value)}
                    placeholder="We're looking for a talented engineer to join our remote-first team..."
                    rows={3}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-indigo-500/50 transition-all resize-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">Status</label>
                <select value={form.status} onChange={e => set('status', e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-indigo-500/50 transition-all appearance-none capitalize">
                  {STATUSES.map(s => <option key={s} value={s} className="bg-[#0d0e1a] capitalize">{s}</option>)}
                </select>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-white/[0.07] flex items-center gap-3 flex-shrink-0">
              <button type="button" onClick={onClose}
                className="flex-1 py-2.5 rounded-xl glass border border-white/[0.08] text-sm text-white/60 hover:text-white transition-all">
                Cancel
              </button>
              <button type="submit" disabled={saving}
                className="flex-1 py-2.5 rounded-xl gradient-bg-primary text-sm font-semibold text-white hover:opacity-90 transition-all shadow-glow-sm disabled:opacity-60 flex items-center justify-center gap-2">
                {saving
                  ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                  : initial ? 'Save Changes' : 'Post Job'
                }
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
