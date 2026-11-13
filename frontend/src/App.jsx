import React, { useState, useEffect } from 'react'
import Home from './pages/Home.jsx'
import DeptDashboard from './pages/DeptDashboard.jsx'
import ExamSetup from './pages/ExamSetup.jsx'
import TimetableView from './pages/TimetableView.jsx'
import { DEPARTMENTS, buildDefaultDeptState } from './data/departments.js'
import { Toaster } from './components/ui/toaster.jsx'

const STORAGE_KEY = 'dbce.exam_scheduler.states.v2'

function loadInitialStates() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      for (const d of DEPARTMENTS) {
        if (!parsed[d.id]) {
          parsed[d.id] = buildDefaultDeptState(d.id)
        }
      }
      return parsed
    }
  } catch (e) {
    console.error('Failed to parse saved department states', e)
  }

  const initial = {}
  for (const d of DEPARTMENTS) {
    initial[d.id] = buildDefaultDeptState(d.id)
  }
  return initial
}

export default function App() {
  // Navigation state: { page: 'home' | 'dashboard' | 'setup' | 'timetable', deptId: string | null }
  const [view, setView] = useState({ page: 'home', deptId: null })

  // Department states (persistent in localStorage)
  const [deptStates, setDeptStates] = useState(loadInitialStates)

  // Save to localStorage whenever deptStates changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(deptStates))
    } catch (e) {
      console.error('Failed to save department states', e)
    }
  }, [deptStates])

  // Navigation handlers
  const handleSelectDept = (deptId) => {
    setView({ page: 'dashboard', deptId })
  }

  const handleGoHome = () => {
    setView({ page: 'home', deptId: null })
  }

  const handleGoSetup = (deptId) => {
    setView({ page: 'setup', deptId })
  }

  const handleGoTimetable = (deptId) => {
    setView({ page: 'timetable', deptId })
  }

  // Update subjects / examConfig without generating
  const handleUpdateDeptData = (deptId, updatedConfig, updatedSubjects) => {
    setDeptStates((prev) => {
      const curr = prev[deptId] || buildDefaultDeptState(deptId)
      return {
        ...prev,
        [deptId]: {
          ...curr,
          examConfig: updatedConfig || curr.examConfig,
          subjects: updatedSubjects || curr.subjects,
        },
      }
    })
  }

  // When a timetable is successfully generated from ExamSetup
  const handleGenerated = (deptId, scheduleResult) => {
    setDeptStates((prev) => {
      const curr = prev[deptId] || buildDefaultDeptState(deptId)
      return {
        ...prev,
        [deptId]: {
          ...curr,
          examConfig: scheduleResult.examConfig || curr.examConfig,
          subjects: scheduleResult.subjects || curr.subjects,
          result: scheduleResult,
        },
      }
    })
    setView({ page: 'timetable', deptId })
  }

  // Delete timetable for demo / reset purposes
  const handleDeleteTimetable = (deptId) => {
    setDeptStates((prev) => {
      const curr = prev[deptId] || buildDefaultDeptState(deptId)
      return {
        ...prev,
        [deptId]: {
          ...curr,
          result: null,
        },
      }
    })
  }

  return (
    <div className="min-h-screen text-slate-800 antialiased selection:bg-brand-100 selection:text-brand-900">
      {view.page === 'home' && (
        <Home deptStates={deptStates} onSelectDept={handleSelectDept} />
      )}

      {view.page === 'dashboard' && view.deptId && (
        <DeptDashboard
          deptId={view.deptId}
          deptState={deptStates[view.deptId]}
          onBack={handleGoHome}
          onGoSetup={() => handleGoSetup(view.deptId)}
          onGoTimetable={() => handleGoTimetable(view.deptId)}
          onDeleteTimetable={() => handleDeleteTimetable(view.deptId)}
        />
      )}

      {view.page === 'setup' && view.deptId && (
        <ExamSetup
          deptId={view.deptId}
          deptState={deptStates[view.deptId]}
          onBack={() => setView({ page: 'dashboard', deptId: view.deptId })}
          onGenerated={(result) => handleGenerated(view.deptId, result)}
          onUpdateDeptData={(newConfig, newSubjects) =>
            handleUpdateDeptData(view.deptId, newConfig, newSubjects)
          }
        />
      )}

      {view.page === 'timetable' && view.deptId && (
        <TimetableView
          deptId={view.deptId}
          deptState={deptStates[view.deptId]}
          onBack={() => setView({ page: 'dashboard', deptId: view.deptId })}
          onGoSetup={() => handleGoSetup(view.deptId)}
          onDeleteTimetable={() => handleDeleteTimetable(view.deptId)}
        />
      )}

      {/* Global Notifications */}
      <Toaster />
    </div>
  )
}
