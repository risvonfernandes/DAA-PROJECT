"""Graph colouring with backtracking (core algorithm).

Vertex = subject, edge = conflict (shared students), colour = exam slot (0..k-1).
"""
import sys
import time

sys.setrecursionlimit(10000)


def build_graph(subject_ids, conflicts):
    """Build an undirected adjacency list {subject: set(neighbours)}.

    Duplicate conflicts are merged. Self-conflicts and unknown subjects raise ValueError.
    """
    ids = list(subject_ids)
    if len(set(ids)) != len(ids):
        raise ValueError("Duplicate subject codes are not allowed.")
    adj = {s: set() for s in ids}
    for pair in conflicts:
        if len(pair) != 2:
            raise ValueError(f"Invalid conflict entry: {pair}")
        a, b = pair
        if a not in adj or b not in adj:
            raise ValueError(f"Conflict refers to an unknown subject: {a} - {b}")
        if a == b:
            raise ValueError(f"A subject cannot conflict with itself: {a}")
        adj[a].add(b)
        adj[b].add(a)
    return adj


def count_edges(adj):
    return sum(len(n) for n in adj.values()) // 2


def vertex_order(adj, mode="degree"):
    """Order in which subjects are coloured.
    'input'  : the order the subjects were entered (plain backtracking).
    'degree' : most-conflicting subjects first (optional heuristic; fails earlier)."""
    nodes = list(adj)
    if mode == "degree":
        return sorted(nodes, key=lambda n: -len(adj[n]))  # sorted() is stable
    return nodes


def graph_coloring_backtracking(adj, k, order_mode="degree", trace=False,
                                max_calls=None, max_trace=3000):
    """Colour the graph with at most k colours using recursive backtracking.

    Returns dict: found, aborted, assignment {subject: slot}, stats, trace, trace_truncated.
    The slot count k is NEVER increased automatically.
    """
    order = vertex_order(adj, order_mode)
    n = len(order)
    assignment = {}
    stats = {"recursive_calls": 0, "assignment_attempts": 0,
             "rejected_assignments": 0, "backtracks": 0}
    events = []
    state = {"aborted": False, "truncated": False}

    def log(ev):
        if not trace:
            return
        if len(events) >= max_trace:
            state["truncated"] = True
        else:
            events.append(ev)

    def solve(i):
        stats["recursive_calls"] += 1
        if max_calls is not None and stats["recursive_calls"] > max_calls:
            state["aborted"] = True          # safety limit, NOT "no solution"
            return False
        if i == n:                            # every subject has a slot -> success
            log({"t": "call", "s": None})
            log({"t": "solution"})
            return True
        subject = order[i]
        log({"t": "call", "s": subject})
        for slot in range(k):                 # try every available slot
            stats["assignment_attempts"] += 1
            log({"t": "try", "s": subject, "slot": slot})
            # conflict check: does an already-coloured neighbour use this slot?
            clash = next((nb for nb in adj[subject] if assignment.get(nb) == slot), None)
            if clash is not None:
                stats["rejected_assignments"] += 1
                log({"t": "reject", "s": subject, "slot": slot, "with": clash})
                continue
            assignment[subject] = slot        # choose
            log({"t": "assign", "s": subject, "slot": slot})
            if solve(i + 1):                  # explore
                return True
            del assignment[subject]           # un-choose (backtrack)
            stats["backtracks"] += 1
            log({"t": "backtrack", "s": subject, "slot": slot})
            if state["aborted"]:
                return False
        return False

    found = solve(0) if n > 0 else True
    return {"found": found and not state["aborted"], "aborted": state["aborted"],
            "assignment": dict(assignment) if found else {}, "stats": stats,
            "trace": events, "trace_truncated": state["truncated"]}


def validate_coloring(adj, assignment, k):
    """Independent check: all subjects coloured, slots in range, no edge has equal colours."""
    for s in adj:
        if s not in assignment or not (0 <= assignment[s] < k):
            return False
    return all(assignment[a] != assignment[b] for a in adj for b in adj[a])


def timed_coloring(adj, k, **kw):
    """Run the algorithm and time ONLY the algorithm call (no HTTP, JSON or drawing)."""
    t0 = time.perf_counter()
    res = graph_coloring_backtracking(adj, k, **kw)
    res["time_ms"] = (time.perf_counter() - t0) * 1000
    return res
