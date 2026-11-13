import React from 'react'
import {
  ChevronLeft,
  BookOpen,
  CalendarClock,
  CheckCircle2,
  Clock,
  Trash2,
  ArrowRight,
  Users,
  Monitor, Zap, Settings, Landmark,
} from 'lucide-react'
import { getDeptById } from '../data/departments.js'
import { ConfirmationDialog } from '../components/ui/confirmation-dialog.jsx'

const DEPT_ICONS = { comp: Monitor, ecs: Zap, mech: Settings, civil: Landmark }
const DEPT_PALETTES = {
  comp:  { accent: 'bg-violet-700', light: 'bg-violet-50 text-violet-700', border: 'border-violet-200' },
  ecs:   { accent: 'bg-blue-700',   light: 'bg-blue-50 text-blue-700',     border: 'border-blue-200' },
  mech:  { accent: 'bg-orange-700', light: 'bg-orange-50 text-orange-700', border: 'border-orange-200' },
  civil: { accent: 'bg-emerald-700',light: 'bg-emerald-50 text-emerald-700',border: 'border-emerald-200' },
}

export default function DeptDashboard({ deptId, deptState, onBack, onGoSetup, onGoTimetable, onDeleteTimetable }) {
  const dept = getDeptById(deptId)
  const [confirmDelete, setConfirmDelete] = React.useState(false)

  if (!dept || !deptState) return null

  const palette = DEPT_PALETTES[deptId] || DEPT_PALETTES.comp
  const Icon = DEPT_ICONS[deptId] || Monitor
  const { examConfig, subjects, result } = deptState
  const hasResult = Boolean(result?.found)

  const seCount = (subjects?.SE || []).length
  const teCount = (subjects?.TE || []).length
  const beCount = (subjects?.BE || []).length
  const totalSubjects = seCount + teCount + beCount

  const StatusBadge = () => {
    if (hasResult)
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-700">
          <CheckCircle2 className="h-3.5 w-3.5" /> Timetable Generated
        </span>
      )
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-semibold text-amber-700">
        <Clock className="h-3.5 w-3.5" /> Not Generated
      </span>
    )
  }

  return (
    <div className="min-h-screen font-sans">
      {/* Top bar */}
      <header className="border-b border-brand-200/60 bg-white/70 backdrop-blur-sm sticky top-0 z-30">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-700 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            All Departments
          </button>
          <span className="text-slate-300">/</span>
          <span className="text-sm font-semibold text-slate-900">{dept.name}</span>
          <div className="ml-auto">
            <StatusBadge />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10 space-y-8">
        {/* Department Hero Card - Description and ISA 1 details removed as requested */}
        <div className="surface overflow-hidden">
          <div className={`h-2 ${palette.accent}`} />
          <div className="p-8 flex flex-col sm:flex-row sm:items-center gap-6">
            <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${palette.light} border ${palette.border}`}>
              <Icon className="h-8 w-8" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {dept.name}
              </h1>
            </div>
            <div className="flex flex-col gap-2 sm:items-end">
              <StatusBadge />
              {hasResult && (
                <span className="text-xs text-slate-400">
                  {result.slots_used} of {result.slots?.length || ((examConfig?.dates?.length || 0) * (examConfig?.sessions?.length || 0)) || '—'} slots used
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Summary Stats - Formatted as (YEAR STUDENTS / X Subjects) without confusing student counts */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'SE STUDENTS', count: seCount, color: 'text-violet-700' },
            { label: 'TE STUDENTS', count: teCount, color: 'text-blue-700' },
            { label: 'BE STUDENTS', count: beCount, color: 'text-emerald-700' },
            { label: 'TOTAL SUBJECTS', count: totalSubjects, color: 'text-slate-800' },
          ].map(({ label, count, color }) => (
            <div key={label} className="surface p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">{label}</p>
              <p className={`text-2xl font-extrabold tracking-tight ${color}`}>
                {count} <span className="text-sm font-semibold text-slate-500">{count === 1 ? 'Subject' : 'Subjects'}</span>
              </p>
            </div>
          ))}
        </div>

        {/* Action Cards */}
        <div>
          <h2 className="section-title mb-4">Actions</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {/* Setup / Edit Schedule */}
            <button
              onClick={onGoSetup}
              className="surface group text-left p-6 hover:shadow-dept hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-700 mb-4 group-hover:bg-brand-700 group-hover:text-white transition-colors">
                <BookOpen className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">
                {hasResult ? 'Edit Schedule Setup' : 'Setup Exam Schedule'}
              </h3>
              <p className="text-xs text-slate-500">
                {hasResult
                  ? 'Modify subjects, exam periods or conflicts and regenerate.'
                  : 'Configure subjects, exam dates and time slots.'}
              </p>
              <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-brand-700">
                Open Setup <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </button>

            {/* View Timetable */}
            <button
              onClick={hasResult ? onGoTimetable : onGoSetup}
              className={`surface group text-left p-6 hover:shadow-dept hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${!hasResult ? 'opacity-60' : ''}`}
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl mb-4 transition-colors ${hasResult ? 'bg-emerald-100 text-emerald-700 group-hover:bg-emerald-700 group-hover:text-white' : 'bg-slate-100 text-slate-400'}`}>
                <CalendarClock className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">View Timetable</h3>
              <p className="text-xs text-slate-500">
                {hasResult
                  ? 'View the generated exam schedule and download it.'
                  : 'Generate a timetable first to view it here.'}
              </p>
              {hasResult && (
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-emerald-700">
                  View Timetable <ArrowRight className="h-3.5 w-3.5" />
                </div>
              )}
            </button>

            {/* Delete Timetable */}
            <button
              onClick={() => hasResult && setConfirmDelete(true)}
              disabled={!hasResult}
              className={`surface group text-left p-6 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 ${
                hasResult ? 'hover:shadow-dept hover:-translate-y-0.5 hover:border-red-100' : 'opacity-40 cursor-not-allowed'
              }`}
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl mb-4 transition-colors ${hasResult ? 'bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white' : 'bg-slate-100 text-slate-400'}`}>
                <Trash2 className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">Delete Timetable</h3>
              <p className="text-xs text-slate-500">
                {hasResult
                  ? 'Remove the generated timetable and start fresh.'
                  : 'No timetable to delete yet.'}
              </p>
              {hasResult && (
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-red-600">
                  Delete <ArrowRight className="h-3.5 w-3.5" />
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Subjects Quick Preview */}
        {totalSubjects > 0 && (
          <div className="surface p-6">
            <h2 className="section-title mb-4">Registered Subjects</h2>
            <div className="grid gap-5 sm:grid-cols-3">
              {[
                { year: 'SE', label: 'Second Year', list: subjects?.SE || [], color: 'bg-violet-50 border-violet-200 text-violet-700' },
                { year: 'TE', label: 'Third Year',  list: subjects?.TE || [], color: 'bg-blue-50 border-blue-200 text-blue-700' },
                { year: 'BE', label: 'Final Year',  list: subjects?.BE || [], color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
              ].map(({ year, label, list, color }) => (
                <div key={year}>
                  <div className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold mb-3 ${color}`}>
                    <Users className="h-3 w-3" /> {year} {dept.abbr} — {label} ({list.length})
                  </div>
                  {list.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No subjects added</p>
                  ) : (
                    <ul className="space-y-1.5">
                      {list.map((s, i) => (
                        <li key={s.code} className="flex items-start gap-2 text-xs text-slate-700">
                          <span className="mt-0.5 h-4 w-4 shrink-0 flex items-center justify-center rounded bg-slate-100 text-slate-500 font-mono text-[10px] font-bold">
                            {i + 1}
                          </span>
                          <div>
                            <span className="font-semibold text-slate-900">{s.code}</span> — {s.name}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Delete Confirmation */}
      <ConfirmationDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Delete Generated Timetable"
        description={`Are you sure you want to delete the generated timetable for ${dept.name}? You can re-generate it at any time.`}
        confirmLabel="Delete Timetable"
        onConfirm={() => { onDeleteTimetable(); setConfirmDelete(false) }}
        variant="destructive"
      />
    </div>
  )
}
