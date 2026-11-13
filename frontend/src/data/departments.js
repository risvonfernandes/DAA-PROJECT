/**
 * DBCE Exam Scheduler — Department & Subject Data
 *
 * Source: Real timetables from Don Bosco College of Engineering, Fatorda-Goa.
 * To strip the sample pre-fill, clear the defaultSubjects arrays below.
 */

export const DEPARTMENTS = [
  {
    id: 'comp',
    name: 'Computer Engineering',
    fullName: 'DEPARTMENT OF COMPUTER ENGINEERING',
    abbr: 'COMP',
    shortCode: 'CSC',
    description: 'Information Technology & Software Development',
    colorClass: 'violet',
    defaultExamConfig: {
      examType: 'ISA 1',
      examLabel: 'ISA 1 : 27th to 29th October 2026',
      dates: [
        { date: '2026-10-27', day: 'Tuesday' },
        { date: '2026-10-28', day: 'Wednesday' },
        { date: '2026-10-29', day: 'Thursday' },
      ],
      sessions: [
        { start: '09:30', end: '10:30' },
        { start: '11:30', end: '12:30' },
      ],
    },
    defaultSubjects: {
      SE: [
        { code: 'CSC-SE-01', name: 'Data Structures and Algorithms using C++' },
        { code: 'CSC-SE-02', name: 'Digital System Design and Analysis' },
        { code: 'CSC-SE-03', name: 'Computer Organization and Architecture' },
        { code: 'CSC-SE-04', name: 'Mathematical Foundation for AI - ML (Major)' },
        { code: 'CSC-SE-05', name: 'Engineering Mathematics - II' },
      ],
      TE: [
        { code: 'CSC-TE-01', name: 'Database Management Systems' },
        { code: 'CSC-TE-02', name: 'Data Communications and Computer Networks' },
        { code: 'CSC-TE-03', name: 'Artificial Intelligence' },
        { code: 'CSC-TE-04', name: 'Data Science and Analytics (Major)' },
        { code: 'CSC-TE-05', name: 'Software Testing & Quality Assurance / Block Chain Technology' },
        { code: 'CSC-TE-06', name: 'Design and Analysis of Algorithms' },
      ],
      BE: [
        { code: 'CSC-BE-01', name: 'Compiler Design' },
        { code: 'CSC-BE-02', name: 'Mobile Computing & Android Programming / Data Analytics' },
        { code: 'CSC-BE-03', name: 'Open Elective (Machine Learning / Additive Manufacturing)' },
        { code: 'CSC-BE-04', name: 'Neural Networks and Deep Learning (Major)' },
      ],
    },
  },

  {
    id: 'ecs',
    name: 'Electronics & Computer Science',
    fullName: 'DEPARTMENT OF ELECTRONICS AND COMPUTER SCIENCE',
    abbr: 'ECS',
    shortCode: 'ECS',
    description: 'Electronics, Circuits & Computing Systems',
    colorClass: 'blue',
    defaultExamConfig: {
      examType: 'ISA 1',
      examLabel: 'ISA 1 : 07th September - 10th September 2026',
      dates: [
        { date: '2026-09-07', day: 'Monday' },
        { date: '2026-09-08', day: 'Tuesday' },
        { date: '2026-09-09', day: 'Wednesday' },
      ],
      sessions: [
        { start: '09:30', end: '10:30' },
        { start: '11:30', end: '12:30' },
      ],
    },
    defaultSubjects: {
      SE: [
        { code: 'ECS-SE-01', name: 'Data Structures using C++' },
        { code: 'ECS-SE-02', name: 'Logic Design' },
        { code: 'ECS-SE-03', name: 'Circuits Analysis and Systems / Communication Technology' },
        { code: 'ECS-SE-04', name: 'Mathematics for Engineers' },
      ],
      TE: [
        { code: 'ECS-TE-01', name: 'Database Management Systems' },
        { code: 'ECS-TE-02', name: 'VLSI Technology and Design' },
        { code: 'ECS-TE-03', name: 'Analog Electronics and Instrumentation' },
        { code: 'ECS-TE-04', name: 'Computer Organization and Operating Systems' },
        { code: 'ECS-TE-05', name: 'Image Processing & Computer Vision / Design and Analysis of Algorithms' },
      ],
      BE: [],
    },
  },

  {
    id: 'mech',
    name: 'Mechanical Engineering',
    fullName: 'DEPARTMENT OF MECHANICAL ENGINEERING',
    abbr: 'MECH',
    shortCode: 'MCH',
    description: 'Mechanical Design & Manufacturing Systems',
    colorClass: 'orange',
    defaultExamConfig: {
      examType: 'Internal Test',
      examLabel: 'Internal Test : 27th Oct - 29th Oct 2026',
      dates: [
        { date: '2026-10-27', day: 'Tuesday' },
        { date: '2026-10-28', day: 'Wednesday' },
        { date: '2026-10-29', day: 'Thursday' },
      ],
      sessions: [
        { start: '09:30', end: '10:30' },
        { start: '11:30', end: '12:30' },
      ],
    },
    defaultSubjects: {
      SE: [
        { code: 'MCH-SE-01', name: 'Strength of Materials' },
        { code: 'MCH-SE-02', name: 'Applied Mathematics - II' },
        { code: 'MCH-SE-03', name: 'Additive Manufacturing (HONS)' },
        { code: 'MCH-SE-04', name: 'Engineering Thermodynamics' },
        { code: 'MCH-SE-05', name: 'Electrical Drives & Instrumentation' },
      ],
      TE: [
        { code: 'MCH-TE-01', name: 'Material Science & Metallurgy' },
        { code: 'MCH-TE-02', name: 'Comp M / MECH / PPE' },
        { code: 'MCH-TE-03', name: 'Manufacturing Technology - II' },
        { code: 'MCH-TE-04', name: 'PLC and SCADA (HONS)' },
        { code: 'MCH-TE-05', name: 'Engineering Statistics' },
        { code: 'MCH-TE-06', name: 'Dynamics of Machines' },
      ],
      BE: [
        { code: 'MCH-BE-01', name: 'CAD / CAM' },
        { code: 'MCH-BE-02', name: 'RAC / A.Manu / SSM' },
        { code: 'MCH-BE-03', name: 'MCAP / ML (Open Elective)' },
        { code: 'MCH-BE-04', name: 'Advanced CNC Technology' },
      ],
    },
  },

  {
    id: 'civil',
    name: 'Civil Engineering',
    fullName: 'DEPARTMENT OF CIVIL ENGINEERING',
    abbr: 'CIVIL',
    shortCode: 'CVL',
    description: 'Structural Design & Infrastructure Engineering',
    colorClass: 'green',
    defaultExamConfig: {
      examType: 'ISA II',
      examLabel: 'ISA II (SE, TE) & IT I (BE) : 27th - 29th October 2026',
      dates: [
        { date: '2026-10-27', day: 'Tuesday' },
        { date: '2026-10-28', day: 'Wednesday' },
        { date: '2026-10-29', day: 'Thursday' },
      ],
      sessions: [
        { start: '09:30', end: '10:30' },
        { start: '11:30', end: '12:30' },
      ],
    },
    defaultSubjects: {
      SE: [
        { code: 'CVL-SE-01', name: 'Strength of Materials' },
        { code: 'CVL-SE-02', name: 'Building Planning and Drawing' },
        { code: 'CVL-SE-03', name: 'Building Materials and Construction' },
        { code: 'CVL-SE-04', name: 'Mathematics for Civil Engineers' },
      ],
      TE: [
        { code: 'CVL-TE-01', name: 'Transportation Engineering I' },
        { code: 'CVL-TE-02', name: 'Geotechnical Engineering I' },
        { code: 'CVL-TE-03', name: 'Design of Concrete Structures I' },
        { code: 'CVL-TE-04', name: 'Water & Waste Water Technology' },
        { code: 'CVL-TE-05', name: 'Environmental Pollution & Control / Finite Element Analysis (Elective)' },
      ],
      BE: [
        { code: 'CVL-BE-01', name: 'Construction Engineering & Management' },
        { code: 'CVL-BE-02', name: 'Structural Repair & Retrofitting' },
        { code: 'CVL-BE-03', name: 'Additive Manufacturing (Open Elective)' },
      ],
    },
  },
]

/** Look up a department object by its id string. */
export const getDeptById = (id) => DEPARTMENTS.find((d) => d.id === id) || null

/** Build the flat subjects list + all intra-year conflict pairs for the backend. */
export function prepareSchedulePayload(subjects, examConfig) {
  const years = ['SE', 'TE', 'BE']

  // Flat list for the backend
  const allSubjects = years.flatMap((yr) =>
    (subjects[yr] || []).map((s) => ({ code: s.code, name: s.name, semester: yr }))
  )

  // Every pair within the same year conflicts (same students, same batch)
  const conflicts = []
  for (const yr of years) {
    const list = subjects[yr] || []
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        conflicts.push([list[i].code, list[j].code])
      }
    }
  }

  // Build slots from dates × sessions
  const slots = []
  for (const dateInfo of examConfig.dates) {
    for (const session of examConfig.sessions) {
      slots.push({
        name: `${dateInfo.date} ${session.start}`, // unique key
        date: dateInfo.date,
        start: session.start,
        end: session.end,
      })
    }
  }

  return { allSubjects, conflicts, slots }
}

/** Build a date→day name lookup from the exam config. */
export function buildDateDayMap(examConfig) {
  const map = {}
  for (const d of examConfig.dates) {
    map[d.date] = d.day
  }
  return map
}

/**
 * Transform the backend timetable response into the display grid format:
 * { date → { day, slots: [{ start, end, SE, TE, BE }] } }
 */
export function buildDisplayGrid(backendTimetable, subjects, examConfig) {
  const dateDay = buildDateDayMap(examConfig)

  // Build code → year lookup
  const codeToYear = {}
  for (const yr of ['SE', 'TE', 'BE']) {
    for (const s of subjects[yr] || []) {
      codeToYear[s.code] = yr
    }
  }

  // Parse slot date/time from slot name ("2026-10-27 09:30") or from the row's date+time fields
  const byDate = {}

  for (const row of backendTimetable) {
    const date = row.date || ''
    const timeParts = (row.time || '').split('-')
    const start = timeParts[0]?.trim() || ''
    const end = timeParts[1]?.trim() || ''

    if (!byDate[date]) {
      byDate[date] = { date, day: dateDay[date] || '', slots: [] }
    }

    const entry = { start, end, SE: '', TE: '', BE: '' }
    for (const subj of row.subjects || []) {
      const yr = codeToYear[subj.code]
      if (yr) entry[yr] = subj.name
    }

    byDate[date].slots.push(entry)
  }

  return byDate
}

/** Create the initial state object for a department from its defaults. */
export function buildDefaultDeptState(deptId) {
  const dept = getDeptById(deptId)
  if (!dept) return null
  return {
    examConfig: JSON.parse(JSON.stringify(dept.defaultExamConfig)),
    subjects: JSON.parse(JSON.stringify(dept.defaultSubjects)),
    result: null,
  }
}
