import { useEffect, useState } from "react";
import { getOverview, getTests, getRiskRanking } from "./services/api";

function App() {
  const [overview, setOverview] = useState(null);
  const [tests, setTests] = useState([]);
  const [error, setError] = useState("");
  const [riskRanking, setRiskRanking] = useState([]);
 useEffect(() => {
  getOverview()
    .then((data) => {
      setOverview(data);
    })
    .catch((err) => {
      setError(err.message);
    });

  getTests()
    .then((data) => {
      setTests(data);
    })
    .catch((err) => {
      setError(err.message);
    });
    getRiskRanking()
  .then((data) => {
    setRiskRanking(data);
  })
  .catch((err) => {
    setError(err.message);
  });
}, []);

  return (
    <div>
      <h1>AI-Driven Adaptive Test Automation</h1>

      <p>Dashboard</p>

      <hr />

      <h2>Overview</h2>

      {error && <p>Error: {error}</p>}

      {!overview && !error && <p>Loading...</p>}

      {overview && (
        <div>
          <p>Total Tests: {overview.totalTests}</p>
          <p>Passed: {overview.passed}</p>
          <p>Failed: {overview.failed}</p>
          <p>Healed: {overview.healed}</p>
          <p>High Risk: {overview.highRisk}</p>
        </div>
      )}
<h2>Test Results</h2>

{tests.length === 0 ? (
  <p>Loading tests...</p>
) : (
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
)}
<h2>Risk Ranking</h2>

{riskRanking.length === 0 ? (
  <p>Loading risk ranking...</p>
) : (
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
)}

      <h2>Execution</h2>
      <p>Adaptive execution results will appear here.</p>
    </div>
  );
}

export default App;