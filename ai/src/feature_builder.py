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
    """Build model features from historical and latest current execution data."""

    historical_data = load_data()
    execution_data = load_execution_results()
    current_tests = convert_to_test_records(execution_data)

    original_count = len(current_tests)

    # Keep ALL historical records for feature calculation.
    #
    # Only reduce CURRENT execution results so that there is
    # one latest execution record per unique test_id.
    latest_tests = {}

    for test in current_tests:
        test_id = test["test_id"]

        if test_id not in latest_tests:
            latest_tests[test_id] = test
            continue

        existing_timestamp = str(
            latest_tests[test_id].get("timestamp", "")
        )

        current_timestamp = str(
            test.get("timestamp", "")
        )

        # Keep the latest execution record for this test.
        if current_timestamp > existing_timestamp:
            latest_tests[test_id] = test

    current_tests = list(latest_tests.values())

    print(
        f"Current execution records: {original_count}"
    )

    print(
        f"Unique latest test records: {len(current_tests)}"
    )

    feature_records = []

    for test in current_tests:
        test_id = test["test_id"]

        # IMPORTANT:
        # Use ALL historical records for this test.
        history = historical_data[
            historical_data["test_id"] == test_id
        ]

        if history.empty:
            print(
                f"Warning: No historical data found for {test_id}"
            )
            continue

        execution_count = len(history)

        failure_count = int(
            history["next_run_failed"].sum()
        )

        avg_duration = round(
            history["avg_duration"].mean(),
            3
        )

        recent_history = history.tail(5)

        recent_failures = int(
            recent_history["next_run_failed"].sum()
        )

        healed_count = round(
            history["healed_count"].mean(),
            3
        )

        # Normalize current automation status.
        current_status = (
            str(test["status"])
            .strip()
            .lower()
        )

        if current_status in {"passed", "failed"}:
            # Actual current execution result.
            last_status = current_status

        elif current_status == "excluded":
            # The test was not executed.
            # Use the most recent historical status instead.
            last_status = (
                str(history.iloc[-1]["last_status"])
                .strip()
                .lower()
            )

        else:
            raise ValueError(
                f"Unsupported test status for {test_id}: "
                f"{test['status']}. "
                f"Expected passed, failed, or excluded."
            )

        if last_status not in {"passed", "failed"}:
            raise ValueError(
                f"Invalid historical last_status for {test_id}: "
                f"{last_status}. "
                f"Expected passed or failed."
            )

        feature_records.append({
            "test_id": test_id,
            "execution_count": execution_count,
            "failure_count": failure_count,
            "avg_duration": avg_duration,
            "recent_failures": recent_failures,
            "healed_count": healed_count,
            "last_status": last_status,
        })

    feature_df = pd.DataFrame(feature_records)

    print(
        f"Tests processed for prediction: "
        f"{len(feature_df)}"
    )

    return feature_df


def prepare_model_features(feature_df):
    """Convert feature records into the format expected by the ML model."""

    model_features = feature_df[FEATURE_COLUMNS].copy()

    model_features["last_status"] = (
        model_features["last_status"]
        .astype(str)
        .str.strip()
        .str.lower()
        .map({
            "passed": 0,
            "failed": 1,
        })
    )

    if model_features.isnull().any().any():
        raise ValueError(
            "Missing or invalid values found in model features."
        )

    return model_features