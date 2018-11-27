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

module.exports = {
  eos,
  getAllTableRows,
  transact
}