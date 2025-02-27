import http from 'k6/http';
import { sleep } from 'k6';
import { AWSConfig, Endpoint, SignatureV4 } from 'https://jslib.k6.io/aws/0.13.0/signature.js';

const awsConfig = new AWSConfig({
  region: __ENV.AWS_REGION,
  accessKeyId: __ENV.AWS_ACCESS_KEY_ID,
  secretAccessKey: __ENV.AWS_SECRET_ACCESS_KEY,
  sessionToken: __ENV.AWS_SESSION_TOKEN,
});

const BASE_URL = "https://states.us-east-2.amazonaws.com";
const STEP_FUNCTION_ARN = __ENV.STEP_FUNCTION_ARN;


const jsonData = {}

export let options = {
  vus: 1,
  iterations: jsonData.length
};

function startStepFunctionExecution(inputData) {
  const path = "/";
  const body = JSON.stringify({
    stateMachineArn: STEP_FUNCTION_ARN,
    input: JSON.stringify(inputData)
  });

  const signer = new SignatureV4({
    service: 'states',
    region: awsConfig.region,
    credentials: {
      accessKeyId: awsConfig.accessKeyId,
      secretAccessKey: awsConfig.secretAccessKey,
      sessionToken: awsConfig.sessionToken,
    },
    uriEscapePath: false,
    applyChecksum: true,
  });

  const signedRequest = signer.sign({
    method: "POST",
    endpoint: new Endpoint(BASE_URL),
    path: path,
    headers: {
      "Content-Type": "application/x-amz-json-1.0",
      "X-Amz-Target": "AWSStepFunctions.StartExecution"
    },
    body: body,
  });

console.log(`🔍 Sending request to: ${BASE_URL}`);
  console.log(`📤 Payload: ${body}`);

  let res = http.request(signedRequest.method, signedRequest.url, signedRequest.body, {
    headers: signedRequest.headers
  });

console.log(`📥 Response from AWS (Status: ${res.status}): ${res.body}`);

  if (res.status !== 200) {
    console.error(`❌ Failed to call Step Function! HTTP Code: ${res.status}`);
    console.error(`📜 Error details: ${res.body}`);
    return;
  }

  let responseJson;
  try {
    responseJson = JSON.parse(res.body);
    console.log(`🚀 Execution Started: ${responseJson.executionArn}`);
  } catch (error) {
    console.error("❌ Error parsing response JSON:", error);
  }
}

export default function () {
  let index = __ITER;
  startStepFunctionExecution(jsonData[index]);
  sleep(1);
}
