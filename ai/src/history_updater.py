import pandas as pd
from pathlib import Path

from data_adapter import load_execution_results, convert_to_test_records
from data_loader import load_data


PROJECT_ROOT = Path(__file__).resolve().parent.parent

HISTORY_PATH = (
    PROJECT_ROOT
    / "data"
    / "raw"
    / "test_execution_history.csv"
)


def build_historical_records():
    """Convert completed automation results into historical records."""

    history = load_data()

    execution_data = load_execution_results()
    current_tests = convert_to_test_records(execution_data)

    # Add timestamp column if it does not exist yet.
    if "timestamp" not in history.columns:
        history["timestamp"] = ""

    new_records = []

    for test in current_tests:

        test_id = test["test_id"]
        execution_timestamp = test["timestamp"]

        if not execution_timestamp:
            raise ValueError(
                f"Execution timestamp not found for {test_id}."
            )

        # Prevent processing the same test execution twice.
        test_already_processed = (
            (history["test_id"].astype(str) == str(test_id))
            & (
                history["timestamp"].astype(str)
                == str(execution_timestamp)
            )
        ).any()

        if test_already_processed:
            print(
                f"Skipping {test_id}: "
                "this execution has already been processed."
            )
            continue

        test_history = history[
            history["test_id"] == test_id
        ]

        if test_history.empty:
            print(
                f"Skipping {test_id}: "
                "no historical data found."
            )
            continue

        # These features describe the test BEFORE
        # the current automation execution.
        execution_count = len(test_history)

        failure_count = int(
            test_history["next_run_failed"].sum()
        )

        avg_duration = round(
            test_history["avg_duration"].mean(),
            3
        )

        recent_history = test_history.tail(5)

        recent_failures = int(
            recent_history["next_run_failed"].sum()
        )

        healed_count = round(
            test_history["healed_count"].mean(),
            3
        )

        # Use the previous status to prevent
        # target leakage.
        last_status = test_history.iloc[-1]["last_status"]

        # Current automation result becomes the target.
        next_run_failed = (
            1 if test["status"] == "failed" else 0
        )

        new_records.append({
            "test_id": test_id,
            "execution_count": execution_count,
            "failure_count": failure_count,
            "avg_duration": avg_duration,
            "recent_failures": recent_failures,
            "healed_count": healed_count,
            "last_status": last_status,
            "next_run_failed": next_run_failed,
            "timestamp": execution_timestamp,
        })

    return pd.DataFrame(new_records)


def append_historical_records(records):
    """Append new execution records to historical data."""

    if records.empty:
        print("No new historical records to add.")
        return

    history = load_data()

    if "timestamp" not in history.columns:
        history["timestamp"] = ""

    updated_history = pd.concat(
        [history, records],
        ignore_index=True
    )

    updated_history.to_csv(
        HISTORY_PATH,
        index=False
    )

    print(
        f"Historical data updated. "
        f"Added {len(records)} records."
    )

    print(
        f"Total historical records: "
        f"{len(updated_history)}"
    )


if __name__ == "__main__":

    records = build_historical_records()

    print("\nNew Historical Records:")

    if records.empty:
        print("No new records generated.")
    else:
        print(
            records.to_string(index=False)
        )

        append_historical_records(records)