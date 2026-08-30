import pandas as pd

from data_adapter import load_execution_results, convert_to_test_records
from data_loader import load_data


FEATURE_COLUMNS = [
    "execution_count",
    "failure_count",
    "avg_duration",
    "recent_failures",
    "healed_count",
    "last_status",
]


def build_features():
    """Build ML features for the current automation test results."""

    historical_data = load_data()

    execution_data = load_execution_results()

    current_tests = convert_to_test_records(
        execution_data
    )

    feature_records = []

    for test in current_tests:

        test_id = test["test_id"]

        # Get historical records for this specific test.
        history = historical_data[
            historical_data["test_id"] == test_id
        ]

        if history.empty:
            print(
                f"Warning: No historical data found for {test_id}"
            )
            continue

        # Historical execution count.
        execution_count = len(history)

        # Number of historical failures.
        failure_count = int(
            history["next_run_failed"].sum()
        )

        # Historical average duration.
        avg_duration = round(
            history["avg_duration"].mean(),
            3
        )

        # Recent failures.
        recent_history = history.tail(5)

        recent_failures = int(
            recent_history["next_run_failed"].sum()
        )

        # Historical healing count.
        healed_count = int(
            history["healed_count"].sum()
        )

        # Use the current automation status.
        last_status = test["status"]

        feature_records.append({
            "test_id": test_id,
            "execution_count": execution_count,
            "failure_count": failure_count,
            "avg_duration": avg_duration,
            "recent_failures": recent_failures,
            "healed_count": healed_count,
            "last_status": last_status,
        })

    return pd.DataFrame(feature_records)


if __name__ == "__main__":

    features = build_features()

    print("\nAI Feature Records:")
    print(features.to_string(index=False))

    print("\nFeature columns:")
    print(
        [
            column
            for column in features.columns
            if column != "test_id"
        ]
    )