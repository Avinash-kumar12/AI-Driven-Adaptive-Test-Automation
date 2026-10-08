const testDefinitions = [
  {
    testId: "TC-STAGE2A-REAL-001",
    name: "Stage 2A Real Login Page Verification",
    targetUrl: "https://the-internet.herokuapp.com/login",
    description:
      "Verify that the real login page is reachable and the username field is present.",
    steps: [
      {
        action: "OPEN",
        locatorType: null,
        locator: null,
        value: "/login"
      },
      {
        action: "VERIFY",
        locatorType: "id",
        locator: "username",
        value: null
      }
    ]
  }
];

module.exports = testDefinitions;
