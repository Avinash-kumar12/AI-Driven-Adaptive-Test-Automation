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
    """Build model features from historical and current execution data."""

    historical_data = load_data()
    execution_data = load_execution_results()
    current_tests = convert_to_test_records(execution_data)

    feature_records = []

    for test in current_tests:

        test_id = test["test_id"]

        history = historical_data[
            historical_data["test_id"] == test_id
        ]

        if history.empty:
            print(f"Warning: No historical data found for {test_id}")
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

        # Use the average healing count so the feature
        # stays on the same scale as the training data.
        healed_count = round(
            history["healed_count"].mean(),
            3
        )

        # Use the latest real automation status.
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


def prepare_model_features(feature_df):
    """Convert feature records into the format expected by the ML model."""

    model_features = feature_df[
        FEATURE_COLUMNS
    ].copy()

    model_features["last_status"] = model_features[
        "last_status"
    ].map({
        "passed": 0,
        "failed": 1,
    })

    if model_features.isnull().any().any():
        raise ValueError(
            "Missing or invalid values found in model features."
        )

    return model_features


if __name__ == "__main__":

    features = build_features()

    model_features = prepare_model_features(
        features
    )

    print("\nAI Feature Records:")
    print(
        features.to_string(index=False)
    )

    print("\nModel Features:")
    print(
        model_features.to_string(index=False)
    )

    print("\nFeature columns:")
    print(
        model_features.columns.tolist()
    )