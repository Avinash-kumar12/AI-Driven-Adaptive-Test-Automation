import random
from pathlib import Path

import pandas as pd


def generate_dataset(number_of_records=500):
    """Generate synthetic test execution history."""

    random.seed(42)

    data = []

    for i in range(1, number_of_records + 1):

        test_id = f"TC{i:04d}"

        execution_count = random.randint(20, 100)

        failure_count = random.randint(0, 15)

        recent_failures = random.randint(0, 5)

        healed_count = random.randint(0, 6)

        avg_duration = round(random.uniform(1.5, 8.0), 2)

        last_status = random.choice(["passed", "failed"])

        # Calculate a risk score from historical behaviour.
        risk_score = (
            failure_count * 0.25
            + recent_failures * 0.40
            + healed_count * 0.15
            + (1.5 if last_status == "failed" else 0)
        )

        # Add some randomness so the dataset is not perfectly predictable.
        risk_score += random.uniform(-1.0, 1.0)

        next_run_failed = 1 if risk_score >= 3.5 else 0

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


def save_dataset(df):
    """Save generated dataset to the raw data directory."""

    project_root = Path(__file__).resolve().parent.parent

    output_path = (
        project_root
        / "data"
        / "raw"
        / "test_execution_history.csv"
    )

    output_path.parent.mkdir(parents=True, exist_ok=True)

    df.to_csv(output_path, index=False)

    print(f"Dataset created: {output_path}")
    print(f"Records: {len(df)}")


if __name__ == "__main__":
    dataset = generate_dataset(500)

    save_dataset(dataset)