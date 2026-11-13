"""Performance measurement: random graphs, repeated timing, default test suite."""
import random
import statistics
from graph_coloring import (build_graph, count_edges, vertex_order,
                            graph_coloring_backtracking, timed_coloring)

MAX_CALLS = 300_000      # safety limit per run
DENSE_THRESHOLD = 0.25   # density >= 0.25 is labelled "dense"


def random_graph(v, e, seed):
    """Reproducible random graph with v vertices and (up to) e edges."""
    rng = random.Random(seed)
    ids = [f"S{i + 1}" for i in range(v)]
    all_pairs = [(ids[i], ids[j]) for i in range(v) for j in range(i + 1, v)]
    e = max(0, min(e, len(all_pairs)))
    return build_graph(ids, rng.sample(all_pairs, e))


def greedy_slots(adj):
    """First-fit colour count (used only to pick a solvable K for test datasets)."""
    col = {}
    for s in vertex_order(adj, "degree"):
        used = {col[n] for n in adj[s] if n in col}
        col[s] = next(c for c in range(len(adj) + 1) if c not in used)
    return max(col.values(), default=-1) + 1


def run_dataset(name, v, e, k, seed, reps=5, order_mode="degree"):
    adj = random_graph(v, e, seed)
    edges = count_edges(adj)
    pairs = v * (v - 1) / 2
    density = edges / pairs if pairs else 0.0
    first = timed_coloring(adj, k, order_mode=order_mode, max_calls=MAX_CALLS)
    times = [first["time_ms"]]
    if not first["aborted"]:                       # repeat to get a stable median
        for _ in range(max(1, reps) - 1):
            times.append(timed_coloring(adj, k, order_mode=order_mode,
                                        max_calls=MAX_CALLS)["time_ms"])
    result = "Aborted (limit)" if first["aborted"] else ("Solved" if first["found"] else "No solution")
    return {"name": name, "category": "dense" if density >= DENSE_THRESHOLD else "sparse",
            "subjects": v, "edges": edges, "slots": k, "density": round(density, 3),
            "seed": seed, "reps": len(times),
            "time_ms": round(statistics.median(times), 4),
            "min_ms": round(min(times), 4), "max_ms": round(max(times), 4),
            "recursive_calls": first["stats"]["recursive_calls"],
            "assignment_attempts": first["stats"]["assignment_attempts"],
            "backtracks": first["stats"]["backtracks"], "result": result}


def default_suite(seed=42):
    """Sparse/dense, small->larger, solvable and unsolvable datasets."""
    specs = []
    for v in (8, 12, 16, 20, 25, 30):
        for label, e in (("sparse", int(1.5 * v)), ("dense", int(0.5 * v * (v - 1) / 2))):
            k = greedy_slots(random_graph(v, e, seed))
            specs.append({"name": f"{label}-{v}", "subjects": v, "edges": e, "slots": k, "seed": seed})
    for v in (10, 14, 18):   # one slot fewer than first-fit used: may be solvable or not
        e = int(0.5 * v * (v - 1) / 2)
        k = greedy_slots(random_graph(v, e, seed)) - 1
        specs.append({"name": f"tight-dense-{v}", "subjects": v, "edges": e, "slots": k, "seed": seed})
    for v in (30, 45, 60):   # larger, tighter sparse graphs: only 3 slots (may hit the safety limit)
        specs.append({"name": f"tight-sparse-{v}", "subjects": v, "edges": int(2.3 * v), "slots": 3, "seed": seed})
    for v in (10, 14):       # clearly unsolvable: dense graph, 2 slots
        specs.append({"name": f"unsolvable-{v}", "subjects": v, "edges": int(0.5 * v * (v - 1) / 2),
                      "slots": 2, "seed": seed})
    return specs


def run_suite(specs, reps=5, order_mode="degree"):
    return [run_dataset(s.get("name", "custom"), s["subjects"], s["edges"], s["slots"],
                        s.get("seed", 42), reps, order_mode) for s in specs]
