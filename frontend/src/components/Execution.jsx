function Execution({ executionResults }) {
  if (executionResults.length === 0) {
    return <p>Loading execution results...</p>;
  }

  return (
    <div>
      <h2>Execution</h2>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Test ID</th>
            <th>Status</th>
            <th>Duration</th>
            <th>Healed</th>
            <th>Message</th>
          </tr>
        </thead>

        <tbody>
          {executionResults.map((result) => (
            <tr key={result.testId}>
              <td>{result.testId}</td>
              <td>{result.status}</td>
              <td>{result.duration}s</td>
              <td>{result.healed ? "Yes" : "No"}</td>
              <td>{result.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Execution;