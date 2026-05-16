'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Header from '@/components/dashboard/Header'
import PostJobModal from '@/components/hiring/PostJobModal'
import { useJobs, type Job } from '@/hooks/useJobs'
import { Briefcase, Users, Clock, CheckCircle, Plus, MapPin, DollarSign, MoreHorizontal, Pencil, Trash2, Globe } from 'lucide-react'

const statusColors: Record<string, string> = {
  open: 'status-active',
  closed: 'status-failed',
  draft: 'text-slate-400 bg-surface-100',
}

const typeColors: Record<string, string> = {
  'Full-time': 'text-brand-600 bg-brand-50',
  'Part-time': 'text-violet-600 bg-violet-50',
  'Contract': 'text-amber-600 bg-amber-50',
  'Internship': 'text-emerald-600 bg-emerald-50',
}

export default function HiringPage() {
  const [activeTab, setActiveTab] = useState<'jobs' | 'applicants'>('jobs')
  const [showModal, setShowModal] = useState(false)
  const [editJob, setEditJob] = useState<Job | null>(null)
  const [menuOpen, setMenuOpen] = useState<string | null>(null)

  const { jobs, loading, isConnected, addJob, updateJob, deleteJob, openJobs, totalApplicants } = useJobs()

  if (!isConnected) {
    return (
      <div>
        <Header title="Hiring" subtitle="Post jobs, track applicants, and onboard contractors" />
        <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="w-16 h-16 rounded-2xl glass border border-slate-200 flex items-center justify-center mx-auto mb-5">
            <Briefcase className="w-7 h-7 text-slate-300" />
          </div>
          <div className="text-sm font-semibold text-slate-900 mb-2">Connect your wallet to manage hiring</div>
          <p className="text-xs text-slate-400 max-w-xs">Job postings are stored securely linked to your wallet address.</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Header
        title="Hiring"
        subtitle="Post jobs, track applicants, and onboard contractors"
        action={{ label: 'Post Job', onClick: () => setShowModal(true) }}
      />

      {showModal && (
        <PostJobModal
          onClose={() => setShowModal(false)}
          onSave={addJob}
        />
      )}

      {editJob && (
        <PostJobModal
          initial={editJob}
          onClose={() => setEditJob(null)}
          onSave={data => { updateJob(editJob.id, data); setEditJob(null) }}
        />
      )}

      <div className="p-8">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Open Roles', value: openJobs.toString(), icon: Briefcase, color: 'text-brand-600', bg: 'from-brand-50 to-brand-50/50' },
            { label: 'Total Applicants', value: totalApplicants.toString(), icon: Users, color: 'text-violet-600', bg: 'from-violet-50 to-violet-50/50' },
            { label: 'Total Positions', value: jobs.length.toString(), icon: Globe, color: 'text-amber-600', bg: 'from-amber-50 to-amber-50/50' },
            { label: 'Hired This Month', value: '0', icon: CheckCircle, color: 'text-emerald-600', bg: 'from-emerald-50 to-emerald-50/50' },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className={`glass rounded-xl border border-slate-100 p-5 bg-gradient-to-b ${bg}`}
            >
              <Icon className={`w-5 h-5 ${color} mb-3`} />
              <div className="text-2xl font-bold text-slate-900">{value}</div>
              <div className="text-xs text-slate-400 mt-0.5">{label}</div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 glass rounded-xl border border-slate-100 p-1 mb-6 w-fit">
          {(['jobs', 'applicants'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                activeTab === tab ? 'gradient-bg-primary text-white' : 'text-slate-400 hover:text-slate-900'
              }`}
            >
              {tab === 'jobs' ? 'Open Positions' : 'Applicants'}
            </button>
          ))}
        </div>

        {activeTab === 'jobs' && (
          loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-6 h-6 border-2 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
            </div>
          ) : jobs.length === 0 ? (
            <div className="glass rounded-2xl border border-slate-100 p-12 flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 rounded-2xl glass border border-slate-200 flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-6 h-6 text-slate-300" />
              </div>
              <div className="text-sm font-semibold text-slate-900 mb-2">No open positions</div>
              <p className="text-xs text-slate-400 max-w-xs mb-6">
                Post your first job listing to start attracting candidates. Manage the hiring pipeline in one place.
              </p>
              <button onClick={() => setShowModal(true)} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-bg-primary text-sm font-semibold text-white hover:opacity-90 transition-all shadow-glow-sm">
                <Plus className="w-4 h-4" />
                Post First Job
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {jobs.map((job, i) => (
                <motion.div key={job.id}
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="glass rounded-2xl border border-slate-100 p-5 hover:border-slate-200 transition-all group relative">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-medium rounded-full px-2 py-0.5 ${statusColors[job.status]}`}>
                          {job.status}
                        </span>
                        <span className={`text-[10px] font-medium rounded-full px-2 py-0.5 ${typeColors[job.type]}`}>
                          {job.type}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-slate-900 truncate">{job.title}</h3>
                      <div className="text-xs text-slate-400 mt-0.5">{job.department}</div>
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => setMenuOpen(menuOpen === job.id ? null : job.id)}
                        className="w-7 h-7 rounded-lg glass border border-slate-200 opacity-0 group-hover:opacity-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all flex-shrink-0">
                        <MoreHorizontal className="w-3.5 h-3.5" />
                      </button>
                      {menuOpen === job.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(null)} />
                          <div className="absolute right-0 top-8 w-40 glass-strong rounded-xl border border-slate-200 shadow-card overflow-hidden z-20">
                            <button onClick={() => { setEditJob(job); setMenuOpen(null) }}
                              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-slate-500 hover:text-slate-900 hover:bg-surface-50 transition-colors text-left">
                              <Pencil className="w-3.5 h-3.5" /> Edit
                            </button>
                            {job.status === 'open' && (
                              <button onClick={() => { updateJob(job.id, { status: 'closed' }); setMenuOpen(null) }}
                                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-amber-600 hover:bg-amber-50 transition-colors text-left">
                                <Clock className="w-3.5 h-3.5" /> Close Role
                              </button>
                            )}
                            <button onClick={() => { deleteJob(job.id); setMenuOpen(null) }}
                              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors text-left">
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {job.location}
                    </div>
                    {(job.salaryMin > 0 || job.salaryMax > 0) && (
                      <div className="flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5" />
                        {job.salaryMin > 0 && job.salaryMax > 0
                          ? `$${job.salaryMin.toLocaleString()}–$${job.salaryMax.toLocaleString()}/mo`
                          : `$${(job.salaryMin || job.salaryMax).toLocaleString()}/mo`}
                      </div>
                    )}
                  </div>

                  {job.description && (
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-3">{job.description}</p>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Users className="w-3.5 h-3.5" />
                      {job.applicants} applicant{job.applicants !== 1 ? 's' : ''}
                    </div>
                    <span className="text-[10px] text-slate-300">
                      Posted {new Date(job.postedAt).toLocaleDateString()}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )
        )}

        {activeTab === 'applicants' && (
          <div className="glass rounded-2xl border border-slate-100 overflow-hidden">
            <div className="grid grid-cols-12 gap-4 px-5 py-3.5 border-b border-slate-100 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
              <div className="col-span-4">Applicant</div>
              <div className="col-span-3">Role Applied</div>
              <div className="col-span-2">Stage</div>
              <div className="col-span-2">Applied</div>
              <div className="col-span-1"></div>
            </div>
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Users className="w-8 h-8 text-slate-200 mb-3" />
              <div className="text-sm text-slate-400">No applicants yet</div>
              <div className="text-xs text-slate-300 mt-1">Post a job to start receiving applications</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
