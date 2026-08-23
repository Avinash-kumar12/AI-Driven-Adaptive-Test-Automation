import joblib
from pathlib import Path

import pandas as pd


PROJECT_ROOT = Path(__file__).resolve().parent.parent

MODEL_PATH = (
    PROJECT_ROOT
    / "models"
    / "failure_prediction_model.joblib"
)


def load_model():
    """Load the trained failure prediction model."""

    model = joblib.load(MODEL_PATH)

    print("Model loaded successfully.")

    return model


def prepare_input(
    execution_count,
    failure_count,
    avg_duration,
    recent_failures,
    healed_count,
    last_status,
):
    """Prepare a new test case for prediction."""

    features = pd.DataFrame([{
        "execution_count": execution_count,
        "failure_count": failure_count,
        "avg_duration": avg_duration,
        "recent_failures": recent_failures,
        "healed_count": healed_count,
        "last_status": last_status,
    }])

    features["last_status"] = features["last_status"].map({
        "passed": 0,
        "failed": 1
    })

    if features.isnull().any().any():
        raise ValueError(
            "Invalid last_status. Use 'passed' or 'failed'."
        )

    return features


def predict_failure(model, features):
    """Predict whether the test is likely to fail."""

    prediction = model.predict(features)[0]

    probability = model.predict_proba(features)[0][1]

    return prediction, probability


def classify_risk(probability):
    """Convert failure probability into a risk level."""

    if probability >= 0.70:
        return "HIGH"

    if probability >= 0.40:
        return "MEDIUM"

    return "LOW"

def prioritize_tests(model, test_cases):
    """Predict failure risk and prioritize multiple test cases."""

    results = []

    for test_case in test_cases:

        test_id = test_case["test_id"]

        features = prepare_input(
            execution_count=test_case["execution_count"],
            failure_count=test_case["failure_count"],
            avg_duration=test_case["avg_duration"],
            recent_failures=test_case["recent_failures"],
            healed_count=test_case["healed_count"],
            last_status=test_case["last_status"],
        )

        prediction, probability = predict_failure(
            model,
            features
        )

        risk_level = classify_risk(probability)

        results.append({
            "test_id": test_id,
            "failure_probability": probability,
            "risk_level": risk_level,
            "prediction": prediction,
        })

    results.sort(
        key=lambda result: result["failure_probability"],
        reverse=True
    )

    return results


if __name__ == "__main__":

    model = load_model()

    test_cases = [
        {
            "test_id": "TC001",
            "execution_count": 50,
            "failure_count": 2,
            "avg_duration": 2.4,
            "recent_failures": 0,
            "healed_count": 0,
            "last_status": "passed",
        },
        {
            "test_id": "TC002",
            "execution_count": 45,
            "failure_count": 12,
            "avg_duration": 5.8,
            "recent_failures": 3,
            "healed_count": 4,
            "last_status": "failed",
        },
        {
            "test_id": "TC003",
            "execution_count": 80,
            "failure_count": 1,
            "avg_duration": 1.9,
            "recent_failures": 0,
            "healed_count": 0,
            "last_status": "passed",
        },
        {
            "test_id": "TC004",
            "execution_count": 35,
            "failure_count": 8,
            "avg_duration": 6.2,
            "recent_failures": 2,
            "healed_count": 3,
            "last_status": "failed",
        },
        {
            "test_id": "TC005",
            "execution_count": 60,
            "failure_count": 4,
            "avg_duration": 3.1,
            "recent_failures": 1,
            "healed_count": 1,
            "last_status": "passed",
        },
    ]

    results = prioritize_tests(
        model,
        test_cases
    )

    print("\nTest Prioritization:")

    for priority, result in enumerate(results, start=1):

        print(
            f"{priority}. "
            f"{result['test_id']} | "
            f"Failure probability: "
            f"{result['failure_probability']:.2%} | "
            f"Risk: {result['risk_level']}"
        )