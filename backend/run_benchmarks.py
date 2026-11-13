"""CLI benchmark runner for the Exam Scheduler.

Runs the default test suite from performance.py, prints a formatted table,
and saves the measurements to benchmark_results.csv.
"""
import argparse
import csv
import sys
from pathlib import Path
from performance import default_suite, run_suite


def parse_args():
    parser = argparse.ArgumentParser(
        description="Run graph colouring performance benchmarks."
    )
    parser.add_argument(
        "-r", "--repetitions",
        type=int,
        default=5,
        help="Number of repetitions per dataset to compute the median time (default: 5)"
    )
    parser.add_argument(
        "-s", "--seed",
        type=int,
        default=42,
        help="Random seed for dataset generation (default: 42)"
    )
    parser.add_argument(
        "-o", "--output",
        type=str,
        default="benchmark_results.csv",
        help="Path to output CSV file (default: benchmark_results.csv)"
    )
    return parser.parse_args()


def main():
    args = parse_args()
    if args.repetitions < 1:
        print("Error: repetitions must be at least 1.", file=sys.stderr)
        sys.exit(1)

    print(f"Running benchmarks (repetitions={args.repetitions}, seed={args.seed})...\n")

    specs = default_suite(seed=args.seed)
    results = run_suite(specs, reps=args.repetitions)

    headers = [
        "Subjects",
        "Edges",
        "Slots",
        "Median time in ms",
        "Recursive calls",
        "Backtracks",
        "Result",
    ]

    rows = []
    for r in results:
        rows.append([
            r["subjects"],
            r["edges"],
            r["slots"],
            f"{r['time_ms']:.4f}",
            r["recursive_calls"],
            r["backtracks"],
            r["result"],
        ])

    col_widths = [len(h) for h in headers]
    for row in rows:
        for i, val in enumerate(row):
            col_widths[i] = max(col_widths[i], len(str(val)))

    header_line = " | ".join(h.ljust(col_widths[i]) for i, h in enumerate(headers))
    separator = "-+-".join("-" * col_widths[i] for i in range(len(headers)))
    print(header_line)
    print(separator)

    for row in rows:
        row_line = " | ".join(
            str(val).rjust(col_widths[i]) if i < 6 else str(val).ljust(col_widths[i])
            for i, val in enumerate(row)
        )
        print(row_line)

    output_path = Path(args.output)
    with open(output_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        writer.writerows(rows)

    print(f"\nSaved {len(rows)} benchmark results to {output_path.resolve()}")


if __name__ == "__main__":
    main()
