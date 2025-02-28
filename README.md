# Fastlane Performance Test with k6

This project uses **k6** to test AWS **Step Functions** execution performance.

## 📌 Overview

This test automates the execution of an AWS **Step Function**, sending different input JSONs and measuring response times.

It uses:

- **k6** → Performance testing framework.
- **AWS** → Run AWS Step Function

---

## 🔧 Prerequisites

### ✅ To Install

1. [K6](https://grafana.com/docs/k6/latest/set-up/install-k6/)

### ⚙️ Environment Variables

Before running the test, set up AWS credentials as environment variables:

```sh
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_SESSION_TOKEN="your-session-token" # Optional (only for temporary credentials)
AWS_REGION="us-east-2"
STEP_FUNCTION_ARN="your-step-function-arn"
```

### ⚙️ Jsons

Before running the test, set up the Jsons (1 or multiples) that you want to run:

```json
[
  {
    "clientName": "",
    "sqlServerSettings": {
      "serverName": "",
      "databaseName": "",
      "databaseType": ""
    },
    "userInput": {
      "isAYOYAPublish": true,
      "visionGroupName": "All"
    }
  },
]
```

## 🚀 Running the Test

To execute the test, simply run:

```sh
k6 run step-function-test.js
```

## 🏎 Running with Multiple Users

To simulate parallel execution, modify the test options in step-function-test.js:

```js
export let options = {
	vus: 3, // 3 virtual users (executing in parallel)
	iterations: 5, // Each user runs 5 times
};
```

This will execute 3 users, each making 5 requests (total = 15 executions).

Alternatively, run for a fixed duration:

```javascript
export let options = {
	vus: 3, // 3 virtual users
	duration: "30s", // Run for 30 seconds
};
```
