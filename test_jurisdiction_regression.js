async function runRegressionTest() {
  console.log("Starting Regression Test for Jurisdiction Input...");
  try {
    const response = await fetch('http://localhost:3001/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'hello' }],
        jurisdiction: 123
      })
    });

    if (response.status === 200 || response.status === 500 && !(await response.text()).includes("toLowerCase is not a function")) {
        console.log("✅ Regression Test Passed: No TypeError crashed the server due to jurisdiction type.");
    } else {
        console.log("❌ Regression Test Failed: Something broke.");
        process.exit(1);
    }
  } catch (err) {
    console.error("Test Error:", err);
    process.exit(1);
  }
}
runRegressionTest();
