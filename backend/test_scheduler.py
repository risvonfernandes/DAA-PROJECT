import pytest
from graph_coloring import build_graph, graph_coloring_backtracking as gc, validate_coloring
from performance import random_graph, run_dataset
from app import app


def run(ids, edges, k, **kw):
    adj = build_graph(ids, edges)
    return adj, gc(adj, k, **kw)


def test_valid_solution():
    adj, r = run(["A", "B", "C", "D"], [["A", "B"], ["B", "C"], ["C", "D"]], 2)
    assert r["found"] and validate_coloring(adj, r["assignment"], 2)


def test_needs_multiple_slots():
    adj, r = run(["A", "B", "C"], [["A", "B"], ["B", "C"], ["A", "C"]], 3)
    assert r["found"] and len(set(r["assignment"].values())) == 3


def test_triangle_two_slots_unsolvable():
    _, r = run(["A", "B", "C"], [["A", "B"], ["B", "C"], ["A", "C"]], 2)
    assert not r["found"] and not r["aborted"] and r["assignment"] == {}


def test_no_edges():
    adj, r = run(["A", "B", "C"], [], 1)
    assert r["found"] and validate_coloring(adj, r["assignment"], 1)


def test_empty_graph():
    _, r = run([], [], 3)
    assert r["found"] and r["assignment"] == {}


def test_isolated_subjects():
    adj, r = run(["A", "B", "X", "Y"], [["A", "B"]], 2)
    assert r["found"] and validate_coloring(adj, r["assignment"], 2)


def test_duplicates_and_invalid_refs():
    adj = build_graph(["A", "B"], [["A", "B"], ["B", "A"]])
    assert adj["A"] == {"B"}
    with pytest.raises(ValueError):
        build_graph(["A"], [["A", "Z"]])
    with pytest.raises(ValueError):
        build_graph(["A"], [["A", "A"]])
    with pytest.raises(ValueError):
        build_graph(["A", "A"], [])


@pytest.mark.parametrize("mode", ["input", "degree"])
@pytest.mark.parametrize("seed", range(8))
def test_random_graphs_always_valid(seed, mode):
    adj = random_graph(12, 25, seed)
    r = gc(adj, 6, order_mode=mode)
    if r["found"]:
        assert validate_coloring(adj, r["assignment"], 6)


def test_counters_consistent():
    adj = random_graph(10, 25, 1)
    r = gc(adj, 4, trace=True)
    s = r["stats"]
    assert s["assignment_attempts"] == s["rejected_assignments"] + sum(e["t"] == "assign" for e in r["trace"])
    assert s["recursive_calls"] == sum(e["t"] == "call" for e in r["trace"])
    assert s["backtracks"] == sum(e["t"] == "backtrack" for e in r["trace"])


def test_abort_is_not_no_solution():
    adj = random_graph(14, 45, 1)
    r = gc(adj, 2, max_calls=1)
    assert r["aborted"] and not r["found"]


def test_performance_row():
    row = run_dataset("t", 10, 15, 4, 1, reps=3)
    assert row["reps"] == 3 and row["recursive_calls"] >= 10 and row["time_ms"] >= 0


def test_api():
    c = app.test_client()
    assert c.get("/api/health").json["status"] == "ok"
    body = {"subjects": [{"code": "A", "name": "a"}, {"code": "B", "name": "b"}], "conflicts": [["A", "B"]],
            "slots": [{"name": "S1"}, {"name": "S2"}], "trace": True}
    r = c.post("/api/schedule", json=body)
    assert r.status_code == 200 and r.json["valid"] and r.json["status"] == "solved"
    body["slots"] = body["slots"][:1]
    assert c.post("/api/schedule", json=body).json["status"] == "no_solution"
    assert c.post("/api/schedule", json={"subjects": [], "slots": [{}]}).status_code == 400
    body["conflicts"] = [["A", "Q"]]
    assert c.post("/api/schedule", json=body).status_code == 400
    assert c.post("/api/performance/run", json={"repetitions": 0}).status_code == 400
