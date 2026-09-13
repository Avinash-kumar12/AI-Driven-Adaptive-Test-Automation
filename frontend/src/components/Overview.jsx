function Overview({ overview }) {
  if (!overview) {
    return <p>Loading overview...</p>;
  }

  return (
    <div>
      <h2>Overview</h2>

      <div>
        <p>Total Tests: {overview.totalTests}</p>
        <p>Passed: {overview.passed}</p>
        <p>Failed: {overview.failed}</p>
        <p>Healed: {overview.healed}</p>
        <p>High Risk: {overview.highRisk}</p>
      </div>
    </div>
  );
}

export default Overview;