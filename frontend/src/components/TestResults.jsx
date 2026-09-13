function TestResults({ tests }) {
  if (tests.length === 0) {
    return <p>Loading tests...</p>;
  }

  return (
    <div>
      <h2>Test Results</h2>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Test ID</th>
            <th>Test Name</th>
            <th>Status</th>
            <th>Duration</th>
            <th>Risk</th>
            <th>Healed</th>
          </tr>
        </thead>

        <tbody>
          {tests.map((test) => (
            <tr key={test.testId}>
              <td>{test.testId}</td>
              <td>{test.testName}</td>
              <td>{test.status}</td>
              <td>{test.duration}s</td>
              <td>{test.riskLevel}</td>
              <td>{test.healed ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TestResults;