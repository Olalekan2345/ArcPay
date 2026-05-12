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

  const addEmployee = (data: Omit<Employee, 'id' | 'avatar' | 'joinDate'>) => {
    const emp: Employee = {
      ...data,
      id: crypto.randomUUID(),
      avatar: getInitials(data.name),
      joinDate: new Date().toISOString().split('T')[0],
    }
    save([...employees, emp])
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
