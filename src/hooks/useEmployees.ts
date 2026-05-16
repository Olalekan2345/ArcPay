'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAccount } from 'wagmi'

export type Employee = {
  id: string
  name: string
  email: string
  role: string
  department: string
  salary: number
  wallet: string
  location: string
  status: 'active' | 'pending' | 'inactive'
  schedule: string
  avatar: string
  joinDate: string
}

function storageKey(address: string) {
  return `arcpay_employees_${address.toLowerCase()}`
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export function useEmployees() {
  const { address, isConnected } = useAccount()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(() => {
    if (!address) { setLoading(false); return }
    try {
      const raw = localStorage.getItem(storageKey(address))
      setEmployees(raw ? JSON.parse(raw) : [])
    } catch {
      setEmployees([])
    }
    setLoading(false)
  }, [address])

  useEffect(() => { load() }, [load])

  const save = (list: Employee[]) => {
    if (!address) return
    localStorage.setItem(storageKey(address), JSON.stringify(list))
    setEmployees(list)
  }

  const addEmployee = async (data: Omit<Employee, 'id' | 'avatar' | 'joinDate'>) => {
    const emp: Employee = {
      ...data,
      id: crypto.randomUUID(),
      avatar: getInitials(data.name),
      joinDate: new Date().toISOString().split('T')[0],
    }
    save([...employees, emp])

    // Resolve org name: settings > wallet address
    let employerName = 'Your Employer'
    if (address) {
      try {
        const settings = localStorage.getItem(`arcpay_settings_${address.toLowerCase()}`)
        if (settings) {
          const parsed = JSON.parse(settings)
          if (parsed.orgName) employerName = parsed.orgName
        }
      } catch {}
      if (employerName === 'Your Employer') {
        employerName = `${address.slice(0, 6)}…${address.slice(-4)}`
      }
    }

    // Fire onboarding email (non-blocking)
    try {
      await fetch('/api/send-onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeName: emp.name,
          employeeEmail: emp.email,
          role: emp.role,
          department: emp.department,
          employerName,
        }),
      })
    } catch {
      // Email failure is non-fatal
    }

    return emp
  }

  const updateEmployee = (id: string, data: Partial<Employee>) => {
    save(employees.map(e => e.id === id ? { ...e, ...data } : e))
  }

  const deleteEmployee = (id: string) => {
    save(employees.filter(e => e.id !== id))
  }

  const totalMonthlyPayroll = employees.reduce((a, e) => a + e.salary, 0)
  const avgSalary = employees.length > 0 ? Math.round(totalMonthlyPayroll / employees.length) : 0
  const departments = new Set(employees.map(e => e.department)).size

  return {
    employees,
    loading,
    isConnected,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    totalMonthlyPayroll,
    avgSalary,
    departments,
  }
}
