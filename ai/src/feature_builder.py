import pandas as pd

from data_adapter import load_m3_execution_history


FEATURE_COLUMNS = [
    "execution_count",
    "failure_count",
    "avg_duration",
    "recent_failures",
    "healed_count",
    "last_status",
]


def _sort_history(rows):
    """Sort real execution history without changing source timestamp values."""

    history = pd.DataFrame(rows)

    if history.empty:
        return history

    history["_timestamp_order"] = pd.to_datetime(
        history["timestamp"],
        errors="coerce",
        utc=True,
    )

    history = history.sort_values(
        by=["_timestamp_order"],
        kind="stable",
        na_position="first",
    ).drop(
        columns=["_timestamp_order"]
    )

    return history


def build_features():
    """Build model features directly from verified M3 execution history."""

    rows = load_m3_execution_history()

    if not rows:
        raise ValueError("No M3 execution history records were found.")

    history = _sort_history(rows)

    feature_records = []

    for test_id, test_history in history.groupby(
        "testId",
        sort=False,
    ):
        test_history = test_history.copy()

        execution_count = len(test_history)

        statuses = (
            test_history["status"]
            .astype(str)
            .str.strip()
            .str.lower()
        )

        failure_count = int(
            (statuses == "failed").sum()
        )

        durations = pd.to_numeric(
            test_history["duration"],
            errors="coerce",
        )

        if durations.isnull().any():
            raise ValueError(
                f"Invalid duration found for {test_id}."
            )

        avg_duration = round(
            durations.mean(),
            3,
        )

        recent_history = test_history.tail(5)

        recent_statuses = (
            recent_history["status"]
            .astype(str)
            .str.strip()
            .str.lower()
        )

        recent_failures = int(
            (recent_statuses == "failed").sum()
        )

        healed_values = pd.to_numeric(
            test_history["healed"],
            errors="coerce",
        )

        if healed_values.isnull().any():
            raise ValueError(
                f"Invalid healed value found for {test_id}."
            )

        # Keep the same feature scale used by the existing model.
        healed_count = round(
            healed_values.mean(),
            3,
        )

        # Excluded is not a pass/fail outcome.
        # If it is the latest execution, use the latest
        # previous pass/fail status instead.
        last_status = None

        for status in reversed(statuses.tolist()):
            if status in {"passed", "failed"}:
                last_status = status
                break

            if status == "excluded":
                continue

            raise ValueError(
                f"Unsupported test status for {test_id}: "
                f"{status}"
            )

        if last_status not in {"passed", "failed"}:
            raise ValueError(
                f"No valid pass/fail status found for {test_id}."
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