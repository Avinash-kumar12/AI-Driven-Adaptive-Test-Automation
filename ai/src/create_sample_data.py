import random
from pathlib import Path

import pandas as pd


PROJECT_ROOT = Path(__file__).resolve().parent.parent

OUTPUT_PATH = (
    PROJECT_ROOT
    / "data"
    / "raw"
    / "test_execution_history.csv"
)


TEST_IDS = [
    "TC-SMOKE-001",
    "TC-HEAL-BASE-002",
    "TC-HEAL-CONNECTION-001",
    "TC-HEAL-ID-001",
    "TC-HEAL-BASE-001",
    "TC-HEAL-CSS-001",
    "TC-HEAL-CLASS-001",
]


def generate_test_history(records_per_test=100):
    """Generate synthetic historical test execution data."""

    random.seed(42)

    data = []

    for test_id in TEST_IDS:

        # Each test gets a different underlying failure tendency.
        test_failure_rate = random.uniform(0.15, 0.60)

        for _ in range(records_per_test):

            # Number of previous executions.
            execution_count = random.randint(10, 100)

            # Number of failures among those previous executions.
            failure_count = int(
                execution_count * test_failure_rate
            )

            # Number of failures in the recent execution window.
            recent_failures = min(
                random.randint(0, 5),
                failure_count
            )

            # Number of healing events.
            healed_count = min(
                random.randint(0, 6),
                failure_count
            )

            # Unstable tests tend to take longer.
            if failure_count >= 8:
                avg_duration = round(
                    random.uniform(4.0, 7.5),
                    2
                )
            else:
                avg_duration = round(
                    random.uniform(1.0, 5.0),
                    2
                )

            # Most recent execution status.
            last_status = random.choice([
                "passed",
                "passed",
                "failed",
            ])

            # Calculate a risk score for the next execution.
            risk_score = (
                (failure_count / max(execution_count, 1)) * 0.55
                + (recent_failures / 5) * 0.25
                + (healed_count / 6) * 0.10
                + (1 if last_status == "failed" else 0) * 0.10
            )

            next_run_failed = 1 if risk_score >= 0.40 else 0

            # Add noise so the model does not learn a perfect rule.
            if random.random() < 0.10:
                next_run_failed = 1 - next_run_failed

            data.append([
                test_id,
                execution_count,
                failure_count,
                avg_duration,
                recent_failures,
                healed_count,
                last_status,
                next_run_failed,
            ])

    columns = [
        "test_id",
        "execution_count",
        "failure_count",
        "avg_duration",
        "recent_failures",
        "healed_count",
        "last_status",
        "next_run_failed",
    ]

    return pd.DataFrame(data, columns=columns)


if __name__ == "__main__":

    df = generate_test_history()

    OUTPUT_PATH.parent.mkdir(
        parents=True,
        exist_ok=True
    )

    df.to_csv(
        OUTPUT_PATH,
        index=False
    )

    print(f"Dataset created: {OUTPUT_PATH}")
    print(f"Records: {len(df)}")
    print(f"Unique tests: {df['test_id'].nunique()}")

    print("\nTarget distribution:")
    print(df["next_run_failed"].value_counts())

    print("\nTarget proportions:")
    print(
        df["next_run_failed"]
        .value_counts(normalize=True)
        .round(3)
    )

    print("\nFeature ranges:")
    print(
        df[
            [
                "execution_count",
                "failure_count",
                "avg_duration",
                "recent_failures",
                "healed_count",
            ]
        ].describe()
    )