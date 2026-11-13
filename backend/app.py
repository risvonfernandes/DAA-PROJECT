"""Flask REST API for the Exam Scheduler."""
from flask import Flask, jsonify, request
from flask_cors import CORS
from graph_coloring import build_graph, count_edges, timed_coloring, validate_coloring
from timetable import build_timetable
from performance import default_suite, run_suite

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173", "http://127.0.0.1:5173"])


def bad(msg, code=400):
    return jsonify({"error": msg}), code


@app.get("/api/health")
def health():
    return jsonify({"status": "ok"})


@app.post("/api/schedule")
def schedule():
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return bad("Request body must be JSON.")
    subjects = data.get("subjects")
    conflicts = data.get("conflicts", [])
    slots = data.get("slots")
    if not isinstance(subjects, list) or not subjects:
        return bad("Add at least one subject before generating a timetable.")
    if not isinstance(slots, list) or not (1 <= len(slots) <= 50):
        return bad("Provide between 1 and 50 exam slots.")
    if not isinstance(conflicts, list):
        return bad("Conflicts must be a list of [codeA, codeB] pairs.")
    try:
        codes = [str(s["code"]).strip() for s in subjects]
        if any(not c for c in codes):
            return bad("Every subject needs a code.")
        for s, c in zip(subjects, codes):
            s["code"] = c
        adj = build_graph(codes, [[str(a), str(b)] for a, b in conflicts])
    except (ValueError, KeyError, TypeError) as e:
        return bad(str(e))
    k = len(slots)
    order = "input" if data.get("heuristic") == "input" else "degree"
    res = timed_coloring(adj, k, order_mode=order, trace=bool(data.get("trace")), max_calls=2_000_000)
    valid = res["found"] and validate_coloring(adj, res["assignment"], k)
    status = "aborted" if res["aborted"] else ("solved" if res["found"] else "no_solution")
    return jsonify({
        "status": status, "found": res["found"], "valid": bool(valid),
        "assignment": res["assignment"],
        "slots_used": len(set(res["assignment"].values())),
        "timetable": build_timetable(subjects, res["assignment"], slots) if res["found"] else [],
        "stats": {**res["stats"], "time_ms": res["time_ms"], "subjects": len(codes),
                  "edges": count_edges(adj), "slots": k},
        "trace": res["trace"], "trace_truncated": res["trace_truncated"],
        "message": {"solved": "Valid timetable found.",
                    "no_solution": f"No valid timetable exists with {k} slot(s). Add slots or remove conflicts.",
                    "aborted": "Search stopped at the safety limit before reaching an answer."}[status],
    })


@app.post("/api/performance/run")
def performance_run():
    data = request.get_json(silent=True) or {}
    try:
        reps = int(data.get("repetitions", 5))
        if not 1 <= reps <= 100:
            return bad("Repetitions must be between 1 and 100.")
        specs = data.get("datasets") or default_suite()
        for s in specs:
            if not (1 <= int(s["subjects"]) <= 200 and int(s["edges"]) >= 0 and 1 <= int(s["slots"]) <= 50):
                return bad("Each dataset needs 1-200 subjects, edges >= 0 and 1-50 slots.")
        specs = [{**s, "subjects": int(s["subjects"]), "edges": int(s["edges"]),
                  "slots": int(s["slots"]), "seed": int(s.get("seed", 42))} for s in specs]
    except (KeyError, TypeError, ValueError):
        return bad("Invalid dataset definition.")
    return jsonify({"results": run_suite(specs, reps),
                    "timer": "time.perf_counter() around the backtracking function only."})


@app.errorhandler(404)
def nf(_):
    return bad("Not found.", 404)


@app.errorhandler(Exception)
def err(_):
    return bad("Something went wrong on the server.", 500)


if __name__ == "__main__":
    app.run(port=5000, debug=False)
