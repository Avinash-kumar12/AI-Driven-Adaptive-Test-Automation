import pandas as pd

from data_adapter import load_m3_execution_history


def build_historical_records():
    """
    Consume and validate the verified M3 execution history.

    The authoritative M3 CSV is read-only for this pipeline step.
    No records are appended to the synthetic training dataset.
    """

    rows = load_m3_execution_history()

    if not rows:
        print("No M3 execution history records found.")
        return pd.DataFrame()

    required_columns = {
        "testId",
        "status",
        "duration",
        "healed",
        "healingScore",
        "timestamp",
    }

    missing_columns = required_columns.difference(rows[0].keys())

    if missing_columns:
        raise ValueError(
            "M3 execution history is missing required columns: "
            + ", ".join(sorted(missing_columns))
        )

    valid_statuses = {
        "passed",
        "failed",
        "excluded",
    }

    for row in rows:
        test_id = str(row["testId"]).strip()
        status = str(row["status"]).strip().lower()

        if not test_id:
            raise ValueError(
                "M3 execution history contains a record without testId."
            )

        if status not in valid_statuses:
            raise ValueError(
                f"Unsupported status for {test_id}: {row['status']}"
            )

        if row["timestamp"] is None:
            raise ValueError(
                f"Timestamp field is missing for {test_id}."
            )

    # Duplicate protection.
    #
    # Only non-empty timestamps can form a reliable
    # testId/timestamp execution key.
    #
    # Empty timestamps are preserved exactly as supplied
    # by M3 and are not treated as duplicates.
    seen = set()
    duplicates = []

    for row in rows:
        test_id = str(row["testId"])
        timestamp = str(row["timestamp"]).strip()

        if not timestamp:
            continue

        key = (
            test_id,
            timestamp,
        )

        if key in seen:
            duplicates.append(key)
        else:
            seen.add(key)

    if duplicates:
        print(
            "Duplicate execution-history keys detected: "
            f"{len(duplicates)}"
        )
    else:
        print("Duplicate execution-history protection: PASS")

    # Excluded executions are not treated as pass/fail
    # training outcomes.
    excluded_count = sum(
        str(row["status"]).strip().lower() == "excluded"
        for row in rows
    )

    if excluded_count:
        print(
            f"Excluded executions found: {excluded_count}. "
            "They are not treated as pass/fail training outcomes."
        )
    else:
        print(
            "Excluded-status handling: PASS "
            "(no excluded records in the M3 history)."
        )

    print(
        "M3 history consumption validated successfully. "
        f"Rows consumed: {len(rows)}"
    )

    # Keep the existing pipeline contract:
    # run_ai_pipeline.py expects a DataFrame.
    return pd.DataFrame(rows)


def append_historical_records(records):
    """
    Preserve the existing pipeline interface.

    Real M3 history is authoritative and read-only, so this
    function intentionally does not append anything to the
    synthetic dataset.
    """

    if records is None or records.empty:
        print("No historical records to process.")
        return

    print(
        "Real M3 history is authoritative; "
        "no historical records were appended or modified."
    )


if __name__ == "__main__":

    records = build_historical_records()

    print("\nM3 History Consumption:")
    print(f"Rows consumed: {len(records)}")