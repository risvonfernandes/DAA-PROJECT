# Don Bosco College of Engineering — Exam Timetable Scheduler

Official examination timetable management portal for **Don Bosco College of Engineering (DBCE), Fatorda-Goa**.
The system schedules examination sessions across the four engineering departments for Second Year (SE), Third Year (TE), and Final Year (BE) students.
Timetables are computed deterministically using recursive backtracking graph-colouring (`backend/graph_coloring.py`), guaranteeing zero conflict overlap between simultaneous student examinations.

```
exam-scheduler/
├── backend/                     # Flask REST API & Graph-Colouring Engine
│   ├── graph_coloring.py        # Core graph-colouring backtracking algorithm
│   ├── timetable.py             # Slot assignment and timetable formatting
│   ├── performance.py           # Benchmark suites & dataset generators
│   ├── run_benchmarks.py        # CLI benchmark runner (prints table & exports CSV)
│   ├── app.py                   # REST endpoints (/api/schedule, /api/health)
│   ├── test_scheduler.py        # Pytest automated test suite (27 passing tests)
│   └── requirements.txt         # Python dependencies (Flask, Flask-CORS, Pytest)
├── frontend/                    # Modern React + Vite + Tailwind CSS Application
│   ├── src/
│   │   ├── pages/               # Home, DeptDashboard, ExamSetup, TimetableView
│   │   ├── components/ui/       # Radix UI accessible styled components
│   │   ├── data/departments.js  # Real pre-filled department and subject catalogs
│   │   ├── services/api.js      # Backend REST API client
│   │   └── App.jsx              # Application router and persistent state
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── README.md                    # Setup and operations guide
└── .gitignore                   # Ignored files (node_modules, venv, caches)
```

---

## Setup on Windows

### 1. Required Software
- **Python 3.10+** from [python.org](https://www.python.org/) (ensure **"Add python.exe to PATH"** is selected during installation)
- **Node.js 18+ (LTS)** from [nodejs.org](https://nodejs.org/)

---

### 2. Backend Setup (Terminal #1)
```cmd
cd exam-scheduler\backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python -m pytest -q
python app.py
```
- `pytest` will report that all 27 automated tests pass.
- Flask serves the API at `http://localhost:5000` (verify health at `http://localhost:5000/api/health`). Keep this terminal open.

*Note:* If PowerShell blocks virtual environment activation, run:
```powershell
Set-ExecutionPolicy -Scope Process RemoteSigned
```

---

### 3. Frontend Setup (Terminal #2)
```cmd
cd exam-scheduler\frontend
npm install
npm run dev
```
- Open **http://localhost:5173** in your web browser.

---

## Department Workflows

The portal supports all four academic departments with pre-populated course data matching official DBCE timetables:
1. **Computer Engineering (COMP)** — ISA 1 (SE, TE, BE)
2. **Electronics & Computer Science (ECS)** — ISA 1 (SE, TE)
3. **Mechanical Engineering (MECH)** — Internal Test (SE, TE, BE)
4. **Civil Engineering (CIVIL)** — ISA II / IT 1 (SE, TE, BE)

### Flow:
1. **Department Portal (Home)**: Select any department to view its status and subject counts.
2. **Department Dashboard**: View student statistics, current status, registered subjects, and quick actions.
3. **Exam Setup**:
   - Configure exam label, test dates, and daily session times (9:30 AM - 10:30 AM, 11:30 AM - 12:30 PM).
   - Review or modify pre-filled subjects for SE, TE, and BE batches with inline validation.
   - Inspect auto-generated student overlap constraints (all subjects in the same academic year conflict).
   - Click **Generate Timetable** to run the conflict-free solver.
4. **Official Timetable View**:
   - Displays the timetable in the authentic **Don Bosco College of Engineering** document layout.
   - Grouped by exam date and morning session with columns for SE, TE, and BE, plus shaded unused slots.
   - Includes official authorization signature blocks (IT Coordinator, HOD, Registrar DBCE, Principal DBCE).
   - **Print / Save as PDF**: Direct clean one-click printing with print-specific layout.
   - **Download Timetable**: Export as a self-contained, standalone HTML document.
   - **Delete Timetable**: Cleanly reset and delete the generated timetable for demo re-runs.

---

## Running Performance Benchmarks (CLI)

The backend includes a command-line benchmark tool to measure algorithm performance across sparse and dense graph datasets without opening the browser:

```cmd
cd exam-scheduler\backend
python run_benchmarks.py
```

### CLI Arguments
| Option | Short | Default | Description |
|---|---|---|---|
| `--repetitions` | `-r` | `5` | Repetitions per graph instance to compute median runtime |
| `--seed` | `-s` | `42` | Random seed for graph generation reproducibility |
| `--output` | `-o` | `benchmark_results.csv` | File path for exported CSV benchmark data |

Example:
```cmd
python run_benchmarks.py --repetitions 10 --seed 42 --output results.csv
```

---

## Common Errors & Troubleshooting

| Problem | Cause & Fix |
|---|---|
| "Cannot reach the backend" in the browser | Flask is not running. Start `python app.py` in `backend/` and keep the terminal open. |
| `python` is not recognized | Python is not in system PATH. Reinstall Python with "Add python.exe to PATH" checked, or invoke via `py`. |
| `npm` is not recognized | Node.js is not installed or the terminal was opened before installation. Install Node.js LTS and restart your terminal. |
| Port 5000 is in use | Change port in `backend/app.py` (e.g. `port=5001`), and update `VITE_API_URL` in `frontend/.env`. |
| CORS error | Access the frontend via `http://localhost:5173` or `http://127.0.0.1:5173` (configured allowed origins). |
