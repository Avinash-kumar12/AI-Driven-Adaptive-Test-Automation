function ExecutionHistory({ executionHistory }) {
  if (executionHistory.length === 0) {
    return <p>No execution history available.</p>;
  }

  return (
    <div>
      <h2>Execution History</h2>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Test ID</th>
            <th>Status</th>
            <th>Risk Level</th>
            <th>Priority</th>
            <th>Failure Probability</th>
            <th>Duration</th>
            <th>Healed</th>
            <th>Executed At</th>
          </tr>
        </thead>

        <tbody>
          {executionHistory.map((result, index) => (
            <tr key={`${result.testId}-${index}`}>
              <td>{result.testId}</td>
              <td>{result.status}</td>
              <td>{result.riskLevel}</td>
              <td>{result.priority}</td>
              <td>{result.failureProbability}</td>
              <td>{result.duration}s</td>
              <td>{result.healed ? "Yes" : "No"}</td>
              <td>{result.executedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ExecutionHistory;