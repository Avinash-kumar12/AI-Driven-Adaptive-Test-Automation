from feature_builder import build_features
from prioritizer import prioritize_test_suite
from prediction_output import save_predictions
from history_updater import (
    build_historical_records,
    append_historical_records,
)


def run_pipeline():
    """Run the complete AI feedback-loop pipeline."""

    print("=" * 60)
    print("AI-DRIVEN ADAPTIVE TEST AUTOMATION PIPELINE")
    print("=" * 60)

    print("\n[1] Updating historical test data...")

    records = build_historical_records()

    if records.empty:
        print("No new automation execution records found.")
    else:
        append_historical_records(records)

    print("\n[2] Building AI features...")
    feature_df = build_features()

    if feature_df.empty:
        raise ValueError("No test features were generated.")

    print(f"Tests processed: {len(feature_df)}")

    print("\n[3] Running ML failure prediction...")
    test_cases = feature_df.to_dict("records")

    results = prioritize_test_suite(test_cases)

    print("\n[4] Saving AI predictions...")
    save_predictions(results)

    print("\n[5] Final Test Priority:")
    print("-" * 60)

    for result in results:
        print(
            f"Priority {result['priority']}: "
            f"{result['test_id']} | "
            f"{result['failure_probability']:.2%} | "
            f"{result['risk_level']}"
        )

    print("-" * 60)
    print("AI feedback-loop pipeline completed successfully.")


if __name__ == "__main__":
    run_pipeline()