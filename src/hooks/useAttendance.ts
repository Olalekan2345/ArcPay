'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAccount } from 'wagmi'
import type { Employee } from './useEmployees'

export type ClockRecord = {
  id: string
  employeeId: string
  employeeName: string
  date: string        // YYYY-MM-DD
  clockIn: string | null   // ISO timestamp
  clockOut: string | null  // ISO timestamp
  hoursWorked: number | null
}

export type DaySummary = {
  date: string
  label: string // 'Mon', 'Tue', etc.
  hours: number | null
  status: 'worked' | 'absent' | 'in-progress' | 'future'
}

export type WeekSummary = {
  employeeId: string
  employeeName: string
  monthlySalary: number
  hourlyRate: number
  days: DaySummary[]
  totalHours: number
  weeklyEarnings: number
}

// 8h/day × 5d/week × 4w/month = 160h/month
const MONTHLY_HOURS = 160

function storageKey(address: string) {
  return `arcpay_attendance_${address.toLowerCase()}`
}

function todayStr() {
  return new Date().toISOString().split('T')[0]
}

function getWeekDates(): { date: string; label: string }[] {
  const now = new Date()
  const day = now.getDay() // 0=Sun, 1=Mon...
  const monday = new Date(now)
  monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1))
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
  return days.map((label, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return { date: d.toISOString().split('T')[0], label }
  })
}

export function useAttendance() {
  const { address } = useAccount()
  const [records, setRecords] = useState<ClockRecord[]>([])

  const load = useCallback(() => {
    if (!address) return
    try {
      const raw = localStorage.getItem(storageKey(address))
      setRecords(raw ? JSON.parse(raw) : [])
    } catch {
      setRecords([])
    }
  }, [address])

  useEffect(() => { load() }, [load])

  const save = (list: ClockRecord[]) => {
    if (!address) return
    localStorage.setItem(storageKey(address), JSON.stringify(list))
    setRecords(list)
  }

  const getRecord = (employeeId: string, date: string) =>
    records.find(r => r.employeeId === employeeId && r.date === date) ?? null

  const clockIn = (employee: Employee) => {
    const today = todayStr()
    const existing = getRecord(employee.id, today)
    if (existing) return // already clocked in/out today

    const rec: ClockRecord = {
      id: crypto.randomUUID(),
      employeeId: employee.id,
      employeeName: employee.name,
      date: today,
      clockIn: new Date().toISOString(),
      clockOut: null,
      hoursWorked: null,
    }
    save([...records, rec])
  }

  const clockOut = (employeeId: string) => {
    const today = todayStr()
    const updated = records.map(r => {
      if (r.employeeId !== employeeId || r.date !== today || r.clockOut) return r
      const outTime = new Date()
      const inTime = new Date(r.clockIn!)
      const hours = Math.round(((outTime.getTime() - inTime.getTime()) / 3_600_000) * 100) / 100
      return { ...r, clockOut: outTime.toISOString(), hoursWorked: hours }
    })
    save(updated)
  }

  const getTodayStatus = (employeeId: string): 'available' | 'clocked-in' | 'clocked-out' => {
    const rec = getRecord(employeeId, todayStr())
    if (!rec) return 'available'
    if (rec.clockOut) return 'clocked-out'
    return 'clocked-in'
  }

  const getTodayRecord = (employeeId: string) => getRecord(employeeId, todayStr())

  const getWeekSummary = (employees: Employee[]): WeekSummary[] => {
    const weekDates = getWeekDates()
    const today = todayStr()

    return employees
      .filter(e => e.status === 'active')
      .map(emp => {
        const hourlyRate = emp.salary / MONTHLY_HOURS
        const days: DaySummary[] = weekDates.map(({ date, label }) => {
          const rec = getRecord(emp.id, date)
          const isFuture = date > today
          const isToday = date === today
          if (isFuture) return { date, label, hours: null, status: 'future' as const }
          if (!rec) return { date, label, hours: null, status: 'absent' as const }
          if (rec.clockIn && !rec.clockOut && isToday)
            return { date, label, hours: null, status: 'in-progress' as const }
          return { date, label, hours: rec.hoursWorked ?? null, status: 'worked' as const }
        })

        const totalHours = days.reduce((a, d) => a + (d.hours ?? 0), 0)
        const weeklyEarnings = Math.round(hourlyRate * totalHours * 100) / 100

        return {
          employeeId: emp.id,
          employeeName: emp.name,
          monthlySalary: emp.salary,
          hourlyRate,
          days,
          totalHours,
          weeklyEarnings,
        }
      })
  }

  return { records, clockIn, clockOut, getTodayStatus, getTodayRecord, getWeekSummary }
}
