[![CircleCI](https://circleci.com/gh/Open-Rights-Exchange/ore-verifier.svg?style=svg)](https://circleci.com/gh/Open-Rights-Exchange/ore-verifier)

## About

The ORE Verifier is an off-chain oracle that verifies transactions for the Open Rights Exchange protocol

## Usage

Each ORE block producer may run one or more Verifier services. The URL of the running service, along with the Public key used by the Verifier to sign access tokens, must be provided to the ore-client library wanting to use this instance.

Endpoints:
- /discovery - Returns the active ORE blockchain URL (GET)
- /usage-update - Updates usage count of a right (POST)
- /verify - Processes request to access a protected right and returns an ore-access-token, target URL, and required additional parameters to access the right's endpoint (POST) 
#

## To run

You must have an .env file to run this service. Copy the .env.example file to .env and populate it with your values. 

```bash
npm start
```

## Deploying to server

Requires Node 10 or higher

Pushing to the master or staging branch triggers a build using CircleCI to Google App Engine (See internal notes on how to change configuration and .env variables)

You can manually deploy to Google App Engine from a local workstation from within the app directory (and using a local .env) by running 
```
gcloud -q app deploy app.yaml
```
