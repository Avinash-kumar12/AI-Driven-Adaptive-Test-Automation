function RiskRanking({ riskRanking }) {
  if (riskRanking.length === 0) {
    return <p>Loading risk ranking...</p>;
  }

  return (
    <div>
      <h2>Risk Ranking</h2>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Test ID</th>
            <th>Failure Probability</th>
            <th>Risk Level</th>
            <th>Prediction</th>
            <th>Priority</th>
          </tr>
        </thead>

        <tbody>
          {riskRanking.map((test) => (
            <tr key={test.testId}>
              <td>{test.testId}</td>
              <td>{test.failureProbability}</td>
              <td>{test.riskLevel}</td>
              <td>{test.prediction}</td>
              <td>{test.priority}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RiskRanking;