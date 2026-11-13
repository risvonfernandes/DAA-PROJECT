import React from 'react'
import {
  GraduationCap,
  Monitor,
  Zap,
  Settings,
  Landmark,
  ArrowRight,
  CheckCircle2,
  Clock,
} from 'lucide-react'
import { DEPARTMENTS } from '../data/departments.js'

const DEPT_ICONS = {
  comp:  Monitor,
  ecs:   Zap,
  mech:  Settings,
  civil: Landmark,
}

const DEPT_COLORS = {
  comp:  { bg: 'bg-violet-50', icon: 'text-violet-700', iconBg: 'bg-violet-100', accent: 'bg-violet-700', ring: 'hover:ring-violet-300' },
  ecs:   { bg: 'bg-blue-50',   icon: 'text-blue-700',   iconBg: 'bg-blue-100',   accent: 'bg-blue-700',   ring: 'hover:ring-blue-300' },
  mech:  { bg: 'bg-orange-50', icon: 'text-orange-700', iconBg: 'bg-orange-100', accent: 'bg-orange-700', ring: 'hover:ring-orange-300' },
  civil: { bg: 'bg-emerald-50',icon: 'text-emerald-700',iconBg: 'bg-emerald-100',accent: 'bg-emerald-700',ring: 'hover:ring-emerald-300' },
}

export default function Home({ deptStates, onSelectDept }) {
  const getDeptInfo = (deptId) => {
    const state = deptStates[deptId]
    if (!state) {
      const dept = DEPARTMENTS.find((d) => d.id === deptId)
      const count = dept ? Object.values(dept.defaultSubjects).flat().length : 0
      return { generated: false, subjectsCount: count }
    }
    const subjectsCount = Object.values(state.subjects || {}).flat().length
    const generated = Boolean(state.result?.found)
    return { generated, subjectsCount }
  }

  return (
    <div className="min-h-screen font-sans">
      {/* Top bar */}
      <header className="border-b border-brand-200/60 bg-white/70 backdrop-blur-sm sticky top-0 z-30">
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-700 text-white shadow-sm">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-bold text-slate-900 tracking-tight">Don Bosco College of Engineering</span>
            <span className="text-[11px] font-medium text-brand-600">Fatorda, Goa</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 mb-5">
            <span className="h-2 w-2 rounded-full bg-brand-500 animate-pulse" />
            <span className="text-xs font-semibold text-brand-700">Examination Office Portal</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
            Exam Timetable <span className="text-brand-700">Management</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            Select a department to view or generate the examination timetable for Second, Third and Final year students.
          </p>
        </div>

        {/* 4 Department Cards */}
        <div className="grid gap-6 sm:grid-cols-2 max-w-4xl mx-auto">
          {DEPARTMENTS.map((dept) => {
            const Icon = DEPT_ICONS[dept.id] || Monitor
            const c = DEPT_COLORS[dept.id]
            const { generated, subjectsCount } = getDeptInfo(dept.id)

            return (
              <button
                key={dept.id}
                onClick={() => onSelectDept(dept.id)}
                className={`group relative text-left w-full rounded-2xl border border-white bg-white shadow-card ring-2 ring-transparent transition-all duration-200 ${c.ring} hover:shadow-dept hover:-translate-y-0.5 focus:outline-none focus-visible:ring-brand-500 focus-visible:ring-offset-2 overflow-hidden`}
              >
                {/* Accent strip */}
                <div className={`h-1.5 w-full ${c.accent} rounded-t-2xl`} />

                <div className="p-6">
                  <div className="flex items-start justify-between mb-5">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${c.iconBg} ${c.icon} transition-transform group-hover:scale-110`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    {generated ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                        <CheckCircle2 className="h-3 w-3" /> Generated
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
                        <Clock className="h-3 w-3" /> Not Generated
                      </span>
                    )}
                  </div>

                  {/* Department Name - Description removed as requested */}
                  <h2 className="text-xl font-bold text-slate-900 mb-6 leading-snug">
                    {dept.name}
                  </h2>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>
                        <strong className="text-slate-700 font-semibold">SE, TE, BE</strong> • {subjectsCount} {subjectsCount === 1 ? 'subject' : 'subjects'}
                      </span>
                    </div>
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${c.iconBg} ${c.icon} transition-transform group-hover:translate-x-0.5`}>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-slate-400 mt-16">
          Don Bosco College of Engineering, Fatorda-Goa &nbsp;·&nbsp; Internal Use Only
        </p>
      </main>
    </div>
  )
}
