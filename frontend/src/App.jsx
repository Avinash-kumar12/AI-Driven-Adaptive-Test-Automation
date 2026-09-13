import { useEffect, useState } from "react";
import Overview from "./components/Overview";
import TestResults from "./components/TestResults";
import RiskRanking from "./components/RiskRanking";
import Execution from "./components/Execution";
import HealingResults from "./components/HealingResults";
import ExecutionHistory from "./components/ExecutionHistory";
import RiskChart from "./charts/RiskChart";

import {
  getOverview,
  getTests,
  getRiskRanking,
  getExecutionResults,
} from "./services/api";

function App() {
  const [overview, setOverview] = useState(null);
  const [tests, setTests] = useState([]);
  const [error, setError] = useState("");
  const [executionResults, setExecutionResults] = useState([]);
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

    getExecutionResults()
      .then((data) => {
        setExecutionResults(data.results);
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

      <Overview overview={overview} />

      {error && <p>Error: {error}</p>}

      <TestResults tests={tests} />

      <RiskRanking riskRanking={riskRanking} />
      <RiskChart riskRanking={riskRanking} />
      <HealingResults tests={tests} />
      <Execution executionResults={executionResults} />
      

      <ExecutionHistory executionResults={executionResults} />
    </div>
  );
}

export default App;