import pandas as pd
from sklearn.model_selection import train_test_split

from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parent.parent
DATA_PATH = PROJECT_ROOT / "data" / "raw" / "test_execution_history.csv"


def load_data():
    """Load historical test execution data."""
    df = pd.read_csv(DATA_PATH)

    print("Dataset loaded successfully.")
    print(f"Rows: {len(df)}")
    print(f"Columns: {len(df.columns)}")

    return df
def prepare_features(df):
    """Prepare model features and target."""

    features = [
        "execution_count",
        "failure_count",
        "avg_duration",
        "recent_failures",
        "healed_count",
        "last_status",
    ]

    target = "next_run_failed"

    X = df[features].copy()
    y = df[target].copy()

    # Convert categorical status into numerical values.
    X["last_status"] = X["last_status"].map({
        "passed": 0,
        "failed": 1
    })

    if X.isnull().any().any():
        raise ValueError("Missing values found in features after encoding.")

    return X, y

def split_data(X, y):
    """Split data into training and testing sets."""

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=42,
        stratify=y
    )

    return X_train, X_test, y_train, y_test

if __name__ == "__main__":
    data = load_data()

    X, y = prepare_features(data)

    X_train, X_test, y_train, y_test = split_data(X, y)

    print("\nTraining features:")
    print(X_train)

    print("\nTesting features:")
    print(X_test)

    print("\nTraining target:")
    print(y_train)

    print("\nTesting target:")
    print(y_test)

    print("\nDataset split:")
    print(f"Training records: {len(X_train)}")
    print(f"Testing records: {len(X_test)}")