'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Header from '@/components/dashboard/Header'
import {
  User, Building2, Shield, Bell, Wallet,
  Check, Zap
} from 'lucide-react'

type SettingsTab = 'profile' | 'organization' | 'security' | 'notifications'

const tabs: { id: SettingsTab; label: string; icon: typeof User }[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'organization', label: 'Organization', icon: Building2 },
  { id: 'security', label: 'Security & Privacy', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile')
  const [saved, setSaved] = useState(false)

  const save = async () => {
    await new Promise(r => setTimeout(r, 600))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <Header title="Settings" subtitle="Manage your account and organization preferences" />

      <div className="p-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-52 flex-shrink-0">
            <nav className="space-y-1">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                    activeTab === id
                      ? 'sidebar-active text-white font-medium'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-surface-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 max-w-2xl">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {activeTab === 'profile' && (
                <>
                  <div className="glass rounded-2xl border border-slate-100 p-6">
                    <h3 className="text-sm font-semibold text-slate-900 mb-5">Personal Information</h3>
                    <div className="flex items-center gap-5 mb-6">
                      <div className="w-16 h-16 rounded-2xl gradient-bg-primary flex items-center justify-center text-xl font-bold text-white">
                        <User className="w-7 h-7 opacity-60" />
                      </div>
                      <div>
                        <button className="text-xs text-brand-600 hover:text-brand-700 transition-colors">Upload avatar</button>
                        <p className="text-xs text-slate-400 mt-0.5">JPG, PNG up to 2MB</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: 'First Name', placeholder: 'Enter first name' },
                        { label: 'Last Name', placeholder: 'Enter last name' },
                        { label: 'Email', placeholder: 'your@email.com' },
                        { label: 'Phone', placeholder: '+1 (000) 000-0000' },
                      ].map(({ label, placeholder }) => (
                        <div key={label}>
                          <label className="block text-xs font-medium text-slate-500 mb-2">{label}</label>
                          <input
                            placeholder={placeholder}
                            className="w-full bg-surface-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-300 outline-none focus:border-brand-400 transition-all"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="glass rounded-2xl border border-slate-100 p-6">
                    <h3 className="text-sm font-semibold text-slate-900 mb-5">Connected Wallet</h3>
                    <div className="flex flex-col items-center justify-center py-8 border border-dashed border-slate-200 rounded-xl text-center">
                      <Wallet className="w-8 h-8 text-slate-200 mb-3" />
                      <div className="text-sm text-slate-400 mb-1">No wallet connected</div>
                      <div className="text-xs text-slate-300">Use the connect button in the top bar to link your wallet</div>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'organization' && (
                <div className="glass rounded-2xl border border-slate-100 p-6">
                  <h3 className="text-sm font-semibold text-slate-900 mb-5">Organization Settings</h3>
                  <div className="space-y-4">
                    {[
                      { label: 'Company Name', placeholder: 'Your company name' },
                      { label: 'Industry', placeholder: 'e.g. Web3 / Fintech' },
                      { label: 'Company Size', placeholder: 'e.g. 1–10 employees' },
                      { label: 'Headquarters', placeholder: 'City, Country' },
                    ].map(({ label, placeholder }) => (
                      <div key={label}>
                        <label className="block text-xs font-medium text-slate-500 mb-2">{label}</label>
                        <input
                          placeholder={placeholder}
                          className="w-full bg-surface-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-300 outline-none focus:border-brand-400 transition-all"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <>
                  <div className="glass rounded-2xl border border-slate-100 p-6">
                    <h3 className="text-sm font-semibold text-slate-900 mb-5">Confidential Compute</h3>
                    <div className="flex items-start justify-between p-4 rounded-xl bg-brand-50 border border-brand-200">
                      <div className="flex gap-3">
                        <Shield className="w-5 h-5 text-brand-600 flex-shrink-0" />
                        <div>
                          <div className="text-sm font-medium text-slate-900 mb-1">Arcium MPC — Active</div>
                          <div className="text-xs text-slate-500 leading-relaxed">All salary data is encrypted using multi-party computation. No party, including ArcPay, can see individual compensation figures during processing.</div>
                        </div>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0 mt-1.5" />
                    </div>
                  </div>
                  <div className="glass rounded-2xl border border-slate-100 p-6">
                    <h3 className="text-sm font-semibold text-slate-900 mb-5">Security Settings</h3>
                    <div className="space-y-4">
                      {[
                        { label: '2-Factor Authentication', desc: 'Require 2FA for all admin actions', enabled: true },
                        { label: 'Payroll Approval Workflow', desc: 'Require multi-sig approval before executing payroll', enabled: true },
                        { label: 'IP Allowlist', desc: 'Restrict access to specific IP addresses', enabled: false },
                        { label: 'Audit Logs', desc: 'Track all admin actions with timestamps', enabled: true },
                      ].map(({ label, desc, enabled }) => (
                        <div key={label} className="flex items-start justify-between py-3 border-b border-slate-100 last:border-0">
                          <div>
                            <div className="text-sm text-slate-900">{label}</div>
                            <div className="text-xs text-slate-400 mt-0.5">{desc}</div>
                          </div>
                          <div className={`relative w-10 h-5 rounded-full transition-all cursor-pointer flex-shrink-0 mt-0.5 ${enabled ? 'bg-brand-600' : 'bg-slate-200'}`} style={{ height: '22px' }}>
                            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${enabled ? 'left-5' : 'left-0.5'}`} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'notifications' && (
                <div className="glass rounded-2xl border border-slate-100 p-6">
                  <h3 className="text-sm font-semibold text-slate-900 mb-5">Notification Preferences</h3>
                  <div className="space-y-4">
                    {[
                      { label: 'Payroll Execution', desc: 'When payroll is processed successfully', email: true, push: true },
                      { label: 'Payment Failures', desc: 'When a payment cannot be completed', email: true, push: true },
                      { label: 'New Applicants', desc: 'When someone applies to an open role', email: false, push: true },
                      { label: 'Treasury Alerts', desc: 'When treasury drops below runway threshold', email: true, push: true },
                      { label: 'Invoice Updates', desc: 'When an invoice is paid or becomes overdue', email: true, push: false },
                    ].map(({ label, desc, email, push }) => (
                      <div key={label} className="flex items-start justify-between py-3 border-b border-slate-100 last:border-0">
                        <div>
                          <div className="text-sm text-slate-900">{label}</div>
                          <div className="text-xs text-slate-400 mt-0.5">{desc}</div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          {[{ label: 'Email', val: email }, { label: 'Push', val: push }].map(({ label: l, val }) => (
                            <div key={l} className="flex items-center gap-1.5">
                              <div className={`w-4 h-4 rounded border flex items-center justify-center ${val ? 'border-brand-600 bg-brand-50' : 'border-slate-200'}`}>
                                {val && <Check className="w-2.5 h-2.5 text-brand-600" />}
                              </div>
                              <span className="text-[10px] text-slate-400">{l}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Network info */}
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl glass border border-brand-200 bg-brand-50">
                <Zap className="w-4 h-4 text-brand-600 flex-shrink-0" />
                <div className="text-xs text-brand-600">
                  <span className="font-semibold">Arc Network Testnet</span> — ArcPay runs on the Arc testnet. No real funds are at risk.
                </div>
              </div>

              {/* Save button */}
              <button
                onClick={save}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all ${
                  saved ? 'bg-emerald-600' : 'gradient-bg-primary shadow-glow-sm hover:opacity-90'
                }`}
              >
                {saved ? <><Check className="w-4 h-4" /> Saved!</> : 'Save Changes'}
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
