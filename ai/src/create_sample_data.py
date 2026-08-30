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

        for _ in range(records_per_test):

            # Create either a low-risk or high-risk execution.
            high_risk = random.random() < 0.5

            if high_risk:
                failure_count = random.randint(6, 15)
                recent_failures = random.randint(2, 5)
                healed_count = random.randint(2, 6)

                last_status = random.choice([
                    "failed",
                    "failed",
                    "passed",
                ])

                avg_duration = round(
                    random.uniform(4.0, 7.5),
                    2
                )

            else:
                failure_count = random.randint(0, 5)
                recent_failures = random.randint(0, 2)
                healed_count = random.randint(0, 2)

                last_status = random.choice([
                    "passed",
                    "passed",
                    "failed",
                ])

                avg_duration = round(
                    random.uniform(1.0, 5.0),
                    2
                )

            execution_count = random.randint(10, 100)

            # High-risk executions normally fail.
            next_run_failed = 1 if high_risk else 0

            # Add some randomness so the model
            # does not learn a perfect rule.
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