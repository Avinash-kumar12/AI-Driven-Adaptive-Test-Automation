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


if __name__ == "__main__":

    model = load_model()

    test_case = prepare_input(
        execution_count=50,
        failure_count=8,
        avg_duration=5.5,
        recent_failures=3,
        healed_count=2,
        last_status="failed",
    )

    prediction, probability = predict_failure(
        model,
        test_case
    )
    risk_level = classify_risk(probability)

    
    print("\nPrediction:")
    print(
        "Likely to fail"
        if prediction == 1
        else "Likely to pass"
    )

    print(f"Failure probability: {probability:.2%}")
    print(f"Risk level: {risk_level}")
