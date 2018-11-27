require('dotenv').config()
const BigNumber = require("bignumber.js")
const fetch = require('node-fetch')
const {
  TextDecoder,
  TextEncoder
} = require('text-encoding');
const eosjs = require('eosjs');

const verifierKey = process.env.VERIFIER_PRIVATE_KEY
const oreNetworkUri = process.env.ORE_NETWORK_URI

const rpc = new eosjs.JsonRpc(oreNetworkUri, {
  fetch
});

const signatureProvider = new eosjs.JsSignatureProvider([verifierKey]);

const eos = new eosjs.Api({
  chainId: process.env.ORE_NETWORK_CHAINID,
  rpc,
  signatureProvider,
  textEncoder: new TextEncoder(),
  textDecoder: new TextDecoder()
});

async function find(contractName, scope, tableName, lowerBound, upperBound, limit = 1, json = true) {
  const records = await eos.getTableRows({
    code: contractName.toString(),
    json: json,
    limit: limit,
    lower_bound: lowerBound.toString(),
    scope: scope.toString(),
    table: tableName.toString(),
    upper_bound: upperBound.toString()
  })
  return records.rows
}

async function getAllTableRows(params, key_field = 'id', json = true) {
  let results = [];
  const lowerBound = 0;
  const limit = -1;
  const parameters = {
    ...params,
    json,
    lower_bound: params.lower_bound || lowerBound,
    scope: params.scope || params.code,
    limit: params.limit || limit,
  };
  results = await eos.rpc.get_table_rows(parameters);
  return results.rows;
}

function transact(actions, blocksBehind = 3, expireSeconds = 30) {
  return eos.transact({
    actions
  }, {
    blocksBehind,
    expireSeconds,
  });
}

async function getContractInstance(contractName, accountName) {
  const options = {
    authorization: `${accountName}@active`,
  };
  const contract = await eos.contract(contractName, options);
  return {
    contract,
    options,
  }
}

module.exports = {
  eos,
  getAllTableRows,
  transact,
  rpc,
}