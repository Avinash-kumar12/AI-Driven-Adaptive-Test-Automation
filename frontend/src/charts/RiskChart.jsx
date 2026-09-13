function RiskChart({ riskRanking }) {
  if (riskRanking.length === 0) {
    return <p>Loading risk chart...</p>;
  }

  return (
    <div>
      <h2>Risk Chart</h2>

      {riskRanking.map((test) => {
        const barWidth = Math.max(test.failureProbability * 100, 2);

        return (
          <div key={test.testId}>
            <p>
              {test.testId}: {test.failureProbability}
            </p>

            <div
              style={{
                width: `${barWidth}%`,
                height: "20px",
                border: "1px solid black",
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

export default RiskChart;