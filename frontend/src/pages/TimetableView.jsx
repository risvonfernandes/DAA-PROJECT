import React, { useMemo, useState } from 'react'
import {
  ChevronLeft,
  Printer,
  Download,
  Trash2,
  Sliders,
  CheckCircle2,
  Info,
} from 'lucide-react'
import { getDeptById, buildDisplayGrid } from '../data/departments.js'
import { ConfirmationDialog } from '../components/ui/confirmation-dialog.jsx'
import { toast } from '../components/ui/use-toast.js'

function formatTimeTo12h(timeStr) {
  if (!timeStr) return ''
  const [hStr, mStr] = timeStr.split(':')
  let h = parseInt(hStr, 10)
  const m = mStr || '00'
  if (isNaN(h)) return timeStr
  const ampm = h >= 12 ? 'PM' : 'AM'
  h = h % 12 || 12
  return `${h}:${m} ${ampm}`
}

function formatDateHeader(dateStr, dayStr) {
  if (!dateStr) return dayStr ? dayStr.toUpperCase() : ''
  const parts = dateStr.split('-')
  let formattedDate = dateStr
  if (parts.length === 3) {
    formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`
  }
  const day = dayStr ? ` (${dayStr.toUpperCase()})` : ''
  return `DATE: ${formattedDate}${day}`
}

export default function TimetableView({
  deptId,
  deptState,
  onBack,
  onGoSetup,
  onDeleteTimetable,
}) {
  const dept = getDeptById(deptId)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const { examConfig, subjects, result } = deptState || {}
  const timetableRows = result?.timetable || []

  // Transform backend timetable rows into date-grouped grid
  const gridByDate = useMemo(() => {
    if (!timetableRows.length || !subjects || !examConfig) return {}
    return buildDisplayGrid(timetableRows, subjects, examConfig)
  }, [timetableRows, subjects, examConfig])

  if (!dept || !deptState || !result?.found) {
    return (
      <div className="min-h-screen p-8 text-center">
        <p className="text-slate-500 mb-4">No timetable generated for this department yet.</p>
        <button onClick={onGoSetup} className="btn-primary">
          Go to Setup
        </button>
      </div>
    )
  }

  // Standalone HTML download (fits on 1 single page)
  const handleDownloadHtml = () => {
    const timetableElem = document.getElementById('official-timetable-doc')
    if (!timetableElem) return

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Time Table - ${dept.name} - DBCE</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 8mm 10mm;
    }
    @media print {
      body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      .no-print { display: none !important; }
    }
    html, body {
      font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
      color: #000;
      background: #fff;
      margin: 0;
      padding: 0;
      font-size: 9.5pt;
      line-height: 1.25;
    }
    .page-wrapper {
      width: 100%;
      max-width: 800px;
      margin: 0 auto;
      padding: 10px;
      box-sizing: border-box;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .header { text-align: center; margin-bottom: 12px; line-height: 1.25; }
    .header .college-line { font-size: 13pt; font-weight: bold; margin: 0; text-transform: uppercase; letter-spacing: 0.5px; }
    .header .exam-label { font-size: 10pt; font-weight: bold; margin: 3px 0 2px 0; }
    .header .title { font-size: 10.5pt; font-weight: bold; text-decoration: underline; margin: 2px 0; text-transform: uppercase; letter-spacing: 1px; }
    .header .dept { font-size: 10.5pt; font-weight: bold; text-decoration: underline; margin: 2px 0; text-transform: uppercase; }
    
    .table-group { margin-bottom: 10px; page-break-inside: avoid; break-inside: avoid; }
    table {
      width: 100%;
      border-collapse: collapse;
      border: 1.5px solid #000;
      margin-bottom: 8px;
    }
    th, td {
      border: 1px solid #000;
      padding: 5px 6px;
      font-size: 9pt;
      vertical-align: middle;
      text-align: center;
      line-height: 1.2;
    }
    th { font-weight: bold; text-transform: uppercase; background: #fff; }
    .date-header {
      background: #fff;
      font-weight: bold;
      text-align: left;
      padding: 4px 8px;
      font-size: 9pt;
    }
    .timing-col { font-weight: bold; width: 22%; white-space: nowrap; font-size: 8.5pt; }
    .year-col { width: 26%; font-weight: bold; font-size: 9pt; }
    .subject-cell { font-weight: 600; font-size: 8.5pt; }
    .empty-slot {
      background-color: #222 !important;
      background-image: repeating-linear-gradient(45deg, #111, #111 4px, #333 4px, #333 8px) !important;
      height: 28px;
    }
    
    .signatures {
      margin-top: 24px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      padding: 0 10px;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .sig-block {
      text-align: center;
      font-size: 8.5pt;
      font-weight: bold;
      width: 22%;
    }
    .sig-line {
      border-top: 1px dashed #444;
      margin-bottom: 4px;
      height: 1px;
    }
  </style>
</head>
<body>
  <div class="page-wrapper">
    ${timetableElem.innerHTML}
  </div>
</body>
</html>`

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `Timetable_${dept.abbr}_DBCE.html`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast({
      title: 'Timetable Downloaded',
      description: `Saved Timetable_${dept.abbr}_DBCE.html successfully.`,
      variant: 'success',
    })
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDelete = () => {
    onDeleteTimetable()
    setConfirmDelete(false)
    toast({
      title: 'Timetable Deleted',
      description: `Generated timetable for ${dept.name} has been removed.`,
      variant: 'default',
    })
    onBack()
  }

  return (
    <div className="min-h-screen font-sans pb-16">
      {/* Top action bar (hidden during print) */}
      <header className="border-b border-brand-200/60 bg-white/80 backdrop-blur-sm sticky top-0 z-30 print:hidden">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-700 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              {dept.name} Dashboard
            </button>
            <span className="text-slate-300">/</span>
            <span className="text-sm font-semibold text-slate-900">Official Timetable</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onGoSetup}
              className="btn-ghost py-2 text-xs"
              title="Edit subjects or slots and regenerate"
            >
              <Sliders className="h-3.5 w-3.5" /> Modify Setup
            </button>
            <button
              onClick={handlePrint}
              className="btn-ghost py-2 text-xs font-semibold"
              title="Print or Save as PDF"
            >
              <Printer className="h-3.5 w-3.5" /> Print / Save PDF
            </button>
            <button
              onClick={handleDownloadHtml}
              className="btn-primary py-2 text-xs"
              title="Download standalone HTML file"
            >
              <Download className="h-3.5 w-3.5" /> Download Timetable
            </button>
            <button
              onClick={() => setConfirmDelete(true)}
              className="btn-danger py-2 text-xs"
              title="Delete this generated timetable"
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-4xl px-4 sm:px-6 pt-6 print:p-0 print:max-w-none">
        {/* Notice for screen viewers (hidden during print) */}
        <div className="surface p-3.5 mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white/95 border-brand-100 print:hidden">
          <div className="flex items-center gap-2.5 text-xs text-slate-600">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold shrink-0">
              <CheckCircle2 className="h-3.5 w-3.5" />
            </span>
            <span>
              Official Timetable formatted to fit perfectly on <strong>1 single page</strong>.
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md">
            <Info className="h-3.5 w-3.5 text-brand-600 shrink-0" />
            <span>In print dialog, uncheck <strong>"Headers and footers"</strong> to remove date/URL.</span>
          </div>
        </div>

        {/* ============================================================== */}
        {/* OFFICIAL TIMETABLE DOCUMENT SHEET (compact, strictly 1 page) */}
        {/* ============================================================== */}
        <div
          id="official-timetable-doc"
          className="bg-white rounded-xl shadow-dept border border-slate-300 p-6 sm:p-8 text-slate-900 print:shadow-none print:border-none print:p-0 print:rounded-none print:m-0"
        >
          {/* Document Header - Single line college & location requested */}
          <div className="text-center mb-4 leading-tight select-none header">
            <h1 className="text-sm sm:text-base font-bold tracking-tight uppercase college-line">
              DON BOSCO COLLEGE OF ENGINEERING, FATORDA-GOA
            </h1>
            <h2 className="text-xs sm:text-sm font-semibold tracking-wide mt-1 exam-label">
              {examConfig?.examLabel || 'INTERNAL EXAMINATION TIME TABLE'}
            </h2>
            <p className="text-xs sm:text-sm font-bold underline tracking-widest mt-1 uppercase title">
              TIME TABLE
            </p>
            <p className="text-xs sm:text-sm font-bold underline tracking-wider mt-1 uppercase dept">
              {dept.fullName || `DEPARTMENT OF ${dept.name.toUpperCase()}`}
            </p>
          </div>

          {/* Grids for Each Date */}
          <div className="space-y-3 print:space-y-2">
            {Object.keys(gridByDate).map((dateKey) => {
              const dayGroup = gridByDate[dateKey]
              const dateHeaderTitle = formatDateHeader(dayGroup.date, dayGroup.day)

              return (
                <div key={dateKey} className="overflow-x-auto table-group">
                  <table className="w-full border-collapse border border-black text-center text-xs">
                    <thead>
                      {/* Date & Session Header */}
                      <tr>
                        <th
                          colSpan={4}
                          className="border border-black bg-white px-2.5 py-1 text-left font-bold text-xs uppercase date-header"
                        >
                          <div className="font-bold">{dateHeaderTitle}</div>
                          <div className="text-[10px] font-semibold tracking-wider text-slate-600">
                            MORNING SESSIONS
                          </div>
                        </th>
                      </tr>
                      {/* Column Headers: Timings, SE, TE, BE */}
                      <tr className="bg-white border-b border-black">
                        <th className="border border-black px-2 py-1 font-bold w-[22%] text-[11px] uppercase timing-col">
                          TIMINGS
                        </th>
                        <th className="border border-black px-2 py-1 font-bold w-[26%] text-[11px] uppercase year-col">
                          SE {dept.abbr}
                        </th>
                        <th className="border border-black px-2 py-1 font-bold w-[26%] text-[11px] uppercase year-col">
                          TE {dept.abbr}
                        </th>
                        <th className="border border-black px-2 py-1 font-bold w-[26%] text-[11px] uppercase year-col">
                          BE {dept.abbr}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {dayGroup.slots.map((slot, sIdx) => {
                        const timingStr = `${formatTimeTo12h(slot.start)} - ${formatTimeTo12h(slot.end)}`

                        return (
                          <tr key={sIdx} className="border-b border-black">
                            {/* Timing Column */}
                            <td className="border border-black px-2 py-1.5 font-bold text-[11px] whitespace-nowrap bg-white timing-col">
                              {timingStr}
                            </td>

                            {/* SE Column */}
                            <td className="border border-black px-2 py-1.5 font-semibold text-[11px] leading-tight subject-cell">
                              {slot.SE ? (
                                <span>{slot.SE}</span>
                              ) : (
                                <div
                                  className="h-6 w-full rounded-xs bg-slate-900/90 print:bg-black empty-slot"
                                  title="No exam scheduled"
                                  style={{
                                    backgroundImage:
                                      'repeating-linear-gradient(45deg, #1e293b, #1e293b 4px, #0f172a 4px, #0f172a 8px)',
                                  }}
                                />
                              )}
                            </td>

                            {/* TE Column */}
                            <td className="border border-black px-2 py-1.5 font-semibold text-[11px] leading-tight subject-cell">
                              {slot.TE ? (
                                <span>{slot.TE}</span>
                              ) : (
                                <div
                                  className="h-6 w-full rounded-xs bg-slate-900/90 print:bg-black empty-slot"
                                  title="No exam scheduled"
                                  style={{
                                    backgroundImage:
                                      'repeating-linear-gradient(45deg, #1e293b, #1e293b 4px, #0f172a 4px, #0f172a 8px)',
                                  }}
                                />
                              )}
                            </td>

                            {/* BE Column */}
                            <td className="border border-black px-2 py-1.5 font-semibold text-[11px] leading-tight subject-cell">
                              {slot.BE ? (
                                <span>{slot.BE}</span>
                              ) : (
                                <div
                                  className="h-6 w-full rounded-xs bg-slate-900/90 print:bg-black empty-slot"
                                  title="No exam scheduled"
                                  style={{
                                    backgroundImage:
                                      'repeating-linear-gradient(45deg, #1e293b, #1e293b 4px, #0f172a 4px, #0f172a 8px)',
                                  }}
                                />
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )
            })}
          </div>

          {/* Official Signatures Row (compact, page-break avoid) */}
          <div className="mt-6 pt-2 grid grid-cols-4 gap-3 text-center text-xs font-bold signatures print:mt-4">
            <div className="space-y-1 sig-block">
              <div className="h-4 border-b border-dashed border-slate-600 mx-auto w-3/4 sig-line" />
              <p className="uppercase text-[10px] text-slate-800">IT Coordinator</p>
            </div>
            <div className="space-y-1 sig-block">
              <div className="h-4 border-b border-dashed border-slate-600 mx-auto w-3/4 sig-line" />
              <p className="uppercase text-[10px] text-slate-800">(HOD. {dept.abbr})</p>
            </div>
            <div className="space-y-1 sig-block">
              <div className="h-4 border-b border-dashed border-slate-600 mx-auto w-3/4 sig-line" />
              <p className="uppercase text-[10px] text-slate-800">(Registrar DBCE)</p>
            </div>
            <div className="space-y-1 sig-block">
              <div className="h-4 border-b border-dashed border-slate-600 mx-auto w-3/4 sig-line" />
              <p className="uppercase text-[10px] text-slate-800">(Principal DBCE)</p>
            </div>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Delete Generated Timetable"
        description={`Are you sure you want to delete the generated timetable for ${dept.name}? You can re-generate it from Setup anytime.`}
        confirmLabel="Delete Timetable"
        onConfirm={handleDelete}
        variant="destructive"
      />
    </div>
  )
}
