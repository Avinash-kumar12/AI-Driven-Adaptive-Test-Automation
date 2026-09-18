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
    """Prepare one test case for model prediction."""

    features = pd.DataFrame([
        {
            "execution_count": execution_count,
            "failure_count": failure_count,
            "avg_duration": avg_duration,
            "recent_failures": recent_failures,
            "healed_count": healed_count,
            "last_status": last_status,
        }
    ])

    # Normalize status before encoding.
    features["last_status"] = (
        features["last_status"]
        .astype(str)
        .str.strip()
        .str.lower()
    )

    # The model itself only accepts passed/failed.
    # 'excluded' should already have been resolved
    # by feature_builder.py to the latest historical status.
    features["last_status"] = (
        features["last_status"]
        .map({
            "passed": 0,
            "failed": 1,
        })
    )

    if features["last_status"].isnull().any():
        raise ValueError(
            "Invalid last_status. "
            "Expected passed or failed."
        )

    return features


def predict_failure(model, features):
    """Predict failure and return probability."""

    prediction = model.predict(features)[0]

    probability = model.predict_proba(
        features
    )[0][1]

    return prediction, probability


def classify_risk(probability):
    """Classify failure probability into a risk level."""

    if probability >= 0.70:
        return "HIGH"

    if probability >= 0.40:
        return "MEDIUM"

    return "LOW"