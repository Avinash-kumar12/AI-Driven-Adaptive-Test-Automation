function HealingResults({ tests }) {
  const healedTests = tests.filter((test) => test.healed);

  if (healedTests.length === 0) {
    return <p>No healing results available.</p>;
  }

  return (
    <div>
      <h2>Healing Results</h2>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Test ID</th>
            <th>Test Name</th>
            <th>Status</th>
            <th>Risk</th>
            <th>Healed</th>
          </tr>
        </thead>

        <tbody>
          {healedTests.map((test) => (
            <tr key={test.testId}>
              <td>{test.testId}</td>
              <td>{test.testName}</td>
              <td>{test.status}</td>
              <td>{test.riskLevel}</td>
              <td>{test.healed ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HealingResults;