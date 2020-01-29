const core = require('@actions/core');
const github = require('@actions/github');
const request = require('request-promise-native');
const dateFormat = require('dateformat');

let deployment =
    {
        schemaVersion: "1.0",
        deploymentSequenceNumber: null,
        updateSequenceNumber: null,
        issueKeys: [],
        displayName: "",
        url: "",
        description: "",
        lastUpdated: "",
        label: "",
        state: "",
        pipeline: {
            id: "",
            displayName: "",
            url: ""
        },
        environment: {
            id: "",
            displayName: "",
            type: ""
        }
    };

let bodyData =
    {
        deployments: []
    };

let options = {
    method: 'POST',
    url: '',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        Authorization: ''
    },
    body: {}
};

async function submitDeploymentInfo() {
    try {
        const cloudId = core.getInput('cloud-id');
        const accessToken = core.getInput('access-token');
        const deploymentSequenceNumber = core.getInput('deployment-sequence-number');
        const updateSequenceNumber = core.getInput('update-sequence-number');
        const issueKeys = core.getInput('issue-keys');
        const displayName = core.getInput('display-name');
        const url = core.getInput('url');
        const description = core.getInput('description');
        let lastUpdated = core.getInput('last-updated');
        const label = core.getInput('label');
        const state = core.getInput('state');
        const pipelineId = core.getInput('pipeline-id');
        const pipelineDisplayName = core.getInput('pipeline-display-name');
        const pipelineUrl = core.getInput('pipeline-url');
        const environmentId = core.getInput('environment-id');
        const environmentDisplayName = core.getInput('environment-display-name');
        const environmentType = core.getInput('environment-type');

        console.log("lastUpdated: " + lastUpdated);
        lastUpdated = dateFormat(lastUpdated, "yyyy-mm-dd'T'HH:MM:ss'Z'");

        deployment.deploymentSequenceNumber = deploymentSequenceNumber;
        deployment.updateSequenceNumber = updateSequenceNumber;
        deployment.issueKeys = issueKeys.split(',');
        deployment.displayName = displayName;
        deployment.url = url;
        deployment.description = description;
        deployment.lastUpdated = lastUpdated;
        deployment.label = label;
        deployment.state = state;
        deployment.pipeline.id = pipelineId;
        deployment.pipeline.displayName = pipelineDisplayName;
        deployment.pipeline.url = pipelineUrl;
        deployment.environment.id = environmentId;
        deployment.environment.displayName = environmentDisplayName;
        deployment.environment.type = environmentType;

        bodyData.deployments = [deployment];
        bodyData = JSON.stringify(bodyData);
        // bodyData = JSON.parse(bodyData);
        // bodyData = JSON.stringify(bodyData);
        // console.log("bodyData: " + bodyData);

        options.body = bodyData;
        options.url = "https://api.atlassian.com/jira/deployments/0.1/cloud/" + cloudId + "/bulk";
        options.headers.Authorization = "Bearer " + accessToken;

        // console.log("options: ", options);

        // const payload = JSON.stringify(github.context.payload, undefined, 2)
        // console.log(`The event payload: ${payload}`);

        let response = await request(options);

        try {
            console.log("try/catch - start");
            // response = JSON.stringify(response);
            // response = JSON.parse(response);
            console.log("response: " + response);
            // console.log("response.rejectedDeployments: ", response.rejectedDeployments);
            console.log("try/catch - end");
        }
        catch(error) {
            console.log("caught error: ", error);
        }

        core.setOutput("response", response);
    } catch (error) {
        core.setFailed(error.message);
    }
}


(async function () {
    await submitDeploymentInfo();
    console.log("finished submitting deployment info");
})();
