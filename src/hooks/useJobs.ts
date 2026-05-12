'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAccount } from 'wagmi'

export type Job = {
  id: string
  title: string
  department: string
  location: string
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship'
  salaryMin: number
  salaryMax: number
  description: string
  status: 'open' | 'closed' | 'draft'
  applicants: number
  postedAt: string
}

function storageKey(address: string) {
  return `arcpay_jobs_${address.toLowerCase()}`
}

export function useJobs() {
  const { address, isConnected } = useAccount()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(() => {
    if (!address) { setLoading(false); return }
    try {
      const raw = localStorage.getItem(storageKey(address))
      setJobs(raw ? JSON.parse(raw) : [])
    } catch {
      setJobs([])
    }
    setLoading(false)
  }, [address])

  useEffect(() => { load() }, [load])

  const save = (list: Job[]) => {
    if (!address) return
    localStorage.setItem(storageKey(address), JSON.stringify(list))
    setJobs(list)
  }

  const addJob = (data: Omit<Job, 'id' | 'postedAt' | 'applicants'>) => {
    const job: Job = {
      ...data,
      id: crypto.randomUUID(),
      applicants: 0,
      postedAt: new Date().toISOString(),
    }
    save([...jobs, job])
    return job
  }

  const updateJob = (id: string, data: Partial<Job>) => {
    save(jobs.map(j => j.id === id ? { ...j, ...data } : j))
  }

  const deleteJob = (id: string) => {
    save(jobs.filter(j => j.id !== id))
  }

  const openJobs = jobs.filter(j => j.status === 'open').length
  const totalApplicants = jobs.reduce((a, j) => a + j.applicants, 0)

  return {
    jobs, loading, isConnected,
    addJob, updateJob, deleteJob,
    openJobs, totalApplicants,
  }
}
