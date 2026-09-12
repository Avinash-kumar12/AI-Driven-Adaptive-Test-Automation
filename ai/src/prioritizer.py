from predict import load_model, prepare_input, predict_failure, classify_risk
from prediction_output import save_predictions
from feature_builder import build_features


def prioritize_test_suite(test_cases):
    """Predict and prioritize a collection of test cases."""

    model = load_model()

    results = []

    for test_case in test_cases:
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
            "test_id": test_case["test_id"],
            "failure_probability": float(probability),
            "risk_level": risk_level,
            "prediction": int(prediction),
        })

    results.sort(
        key=lambda result: result["failure_probability"],
        reverse=True
    )

    for priority, result in enumerate(results, start=1):
        result["priority"] = priority

    return results


if __name__ == "__main__":

    # Build features from the latest automation results
    feature_df = build_features()

    # Convert DataFrame records into the format expected
    # by prioritize_test_suite()
    test_cases = feature_df.to_dict("records")

    # Predict failure risk and prioritize the tests
    results = prioritize_test_suite(test_cases)

    # Save predictions to JSON
    save_predictions(results)

    print("\nAI-Predicted Test Prioritization:")

    for result in results:
        print(
            f"Priority {result['priority']}: "
            f"{result['test_id']} | "
            f"Failure probability: "
            f"{result['failure_probability']:.2%} | "
            f"Risk: {result['risk_level']}"
        )