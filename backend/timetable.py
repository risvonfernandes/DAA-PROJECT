"""Turns a colouring into a readable timetable."""


def build_timetable(subjects, assignment, slots):
    by_code = {s["code"]: s for s in subjects}
    rows = []
    for i, slot in enumerate(slots):
        codes = [c for c in by_code if assignment.get(c) == i]
        rows.append({
            "slot": slot.get("name") or f"Slot {i + 1}",
            "date": slot.get("date", ""),
            "time": f'{slot.get("start", "")}-{slot.get("end", "")}'.strip("-"),
            "subjects": [{"code": c, "name": by_code[c]["name"]} for c in codes],
        })
    return rows
