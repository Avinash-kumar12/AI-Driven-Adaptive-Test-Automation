import json
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parent.parent

OUTPUT_PATH = (
    PROJECT_ROOT
    / "data"
    / "processed"
    / "prioritized_tests.json"
)


def save_predictions(results):
    """Save prioritized test results as a JSON file."""

    OUTPUT_PATH.parent.mkdir(
        parents=True,
        exist_ok=True
    )

    serializable_results = []

    for result in results:
        serializable_results.append({
            "test_id": result["test_id"],
            "failure_probability": float(
                result["failure_probability"]
            ),
            "risk_level": result["risk_level"],
            "prediction": int(
                result["prediction"]
            ),
            "priority": int(
                result["priority"]
            ),
        })

    output = {
        "tests": serializable_results
    }

    with open(OUTPUT_PATH, "w", encoding="utf-8") as file:
        json.dump(
            output,
            file,
            indent=4
        )

    print(f"Predictions saved to: {OUTPUT_PATH}")