import pandas as pd


DATA_PATH = "data/raw/test_execution_history.csv"


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


if __name__ == "__main__":
    data = load_data()

    X, y = prepare_features(data)

    print("\nFeatures (X):")
    print(X)

    print("\nTarget (y):")
    print(y)