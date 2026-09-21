import csv
import json
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent

RESULTS_PATH = (
    PROJECT_ROOT
    / "automation"
    / "results"
    / "test-results.json"
)

M3_HISTORY_PATH = (
    PROJECT_ROOT
    / "ai"
    / "data"
    / "raw"
    / "m3_execution_history_export.csv"
)


def load_execution_results():
    """Load test execution results from the automation framework."""

    if not RESULTS_PATH.exists():
        raise FileNotFoundError(
            f"Test results file not found: {RESULTS_PATH}"
        )

    with open(
        RESULTS_PATH,
        "r",
        encoding="utf-8"
    ) as file:
        data = json.load(file)

    print("Test execution results loaded successfully.")
    print(f"Tests found: {len(data.get('tests', []))}")

    return data


def convert_to_test_records(data):
    """Convert individual automation tests into standardized records."""

    test_records = []

    for test in data["tests"]:
        record = {
            "test_id": test["testId"],
            "test_name": test["testName"],
            "status": test["status"],
            "duration": test["duration"],
            "healed": test["healed"],
            "healing_score": test["healingScore"],
            "module": test["module"],
            "scenario": test["scenario"],
            "locator_type": test["locatorType"],
            "healing_expected": test["healingExpected"],
            "timestamp": test["timestamp"],
        }

        test_records.append(record)

    return test_records


def load_m3_execution_history():
    """Load the verified M3 execution-history CSV."""

    if not M3_HISTORY_PATH.exists():
        raise FileNotFoundError(
            f"M3 execution history not found: {M3_HISTORY_PATH}"
        )

    with open(
        M3_HISTORY_PATH,
        "r",
        encoding="utf-8",
        newline=""
    ) as file:
        rows = list(csv.DictReader(file))

    print("M3 execution history loaded successfully.")
    print(f"Rows found: {len(rows)}")

    return rows


if __name__ == "__main__":

    data = load_execution_results()

    test_records = convert_to_test_records(data)

    print("\nStandardized Test Records:")

    for record in test_records:
        print(
            f"{record['test_id']} | "
            f"Status: {record['status']} | "
            f"Duration: {record['duration']}s | "
            f"Healed: {record['healed']} | "
            f"Scenario: {record['scenario']}"
        )