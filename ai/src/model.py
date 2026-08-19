from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
)

from data_loader import load_data, prepare_features, split_data


def train_model(X_train, y_train):
    """Train the failure prediction model."""

    model = LogisticRegression(max_iter=1000)

    model.fit(X_train, y_train)

    return model


if __name__ == "__main__":
    data = load_data()

    X, y = prepare_features(data)

    X_train, X_test, y_train, y_test = split_data(X, y)

    model = train_model(X_train, y_train)

    predictions = model.predict(X_test)
    accuracy = accuracy_score(y_test, predictions)
    precision = precision_score(y_test, predictions, zero_division=0)
    recall = recall_score(y_test, predictions, zero_division=0)
    f1 = f1_score(y_test, predictions, zero_division=0)
    matrix = confusion_matrix(y_test, predictions)

    print("\nModel Evaluation:")
    print(f"Accuracy:  {accuracy:.2f}")
    print(f"Precision: {precision:.2f}")
    print(f"Recall:    {recall:.2f}")
    print(f"F1 Score:  {f1:.2f}")

    print("\nConfusion Matrix:")
    print(matrix)


    print("\nActual values:")
    print(y_test.to_numpy())

    print("\nPredicted values:")
    print(predictions)