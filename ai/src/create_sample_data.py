import pandas as pd

data = [
    ["TC001", 50, 2, 2.4, 0, 0, "passed", 0],
    ["TC002", 45, 12, 5.8, 3, 4, "failed", 1],
    ["TC003", 80, 1, 1.9, 0, 0, "passed", 0],
    ["TC004", 35, 8, 6.2, 2, 3, "failed", 1],
    ["TC005", 60, 4, 3.1, 1, 1, "passed", 0],
    ["TC006", 25, 10, 7.4, 4, 5, "failed", 1],
    ["TC007", 90, 0, 1.5, 0, 0, "passed", 0],
    ["TC008", 40, 6, 4.8, 2, 2, "failed", 1],
    ["TC009", 70, 3, 2.8, 1, 1, "passed", 0],
    ["TC010", 30, 9, 6.9, 3, 4, "failed", 1],
]

columns = [
    "test_id",
    "execution_count",
    "failure_count",
    "avg_duration",
    "recent_failures",
    "healed_count",
    "last_status",
    "next_run_failed",
]

df = pd.DataFrame(data, columns=columns)

output_path = "data/raw/test_execution_history.csv"
df.to_csv(output_path, index=False)

print(f"Dataset created: {output_path}")
print(f"Records: {len(df)}")