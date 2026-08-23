from predict import load_model, prepare_input, predict_failure, classify_risk
from prediction_output import save_predictions

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
            "failure_probability": probability,
            "risk_level": risk_level,
            "prediction": prediction,
        })

    results.sort(
        key=lambda result: result["failure_probability"],
        reverse=True
    )

    for priority, result in enumerate(results, start=1):
        result["priority"] = priority

    return results

if __name__ == "__main__":

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
    ]

    results = prioritize_test_suite(test_cases)

    save_predictions(results)

    print("\nPrioritized Test Suite:")

    for result in results:
        print(
            f"Priority {result['priority']}: "
            f"{result['test_id']} | "
            f"Failure probability: "
            f"{result['failure_probability']:.2%} | "
            f"Risk: {result['risk_level']}"
        )