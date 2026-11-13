const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

async function post(path, body) {
  let res
  try {
    res = await fetch(BASE + path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  } catch {
    throw new Error('Cannot reach the backend. Start Flask with "python app.py" in the backend folder.')
  }
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'Request failed.')
  return data
}

export const runSchedule = (body) => post('/schedule', body)
export const runPerformance = (body) => post('/performance/run', body)
