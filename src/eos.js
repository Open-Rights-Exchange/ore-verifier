const Eos = require('eosjs')
const BigNumber = require("bignumber.js")

const verifierKey = process.env.VERIFIER_PRIVATE_KEY
const oreNetworkUri = process.env.ORE_NETWORK_URI
const eosTimeout = process.EOS_TRANSACTION_EXPIRE_SECONDS

config = {
  chainId: process.env.ORE_NETWORK_CHAINID,
  keyProvider: [verifierKey],
  httpEndpoint: oreNetworkUri,
  expireInSeconds: eosTimeout,
  broadcast: true,
  verbose: false,
  sign: true
}

const eos = Eos(config)

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

// Transform account names from base32 to their numeric representations
function tableKey(account) {
  return new BigNumber(Eos.modules.format.encodeName(account, false))
}

// Finds a row in the table within the scope and matching parameters
async function findOne(contractName, scope, tableName, tableKey, json = true) {
  const rows = await find(contractName, scope, tableName, tableKey, tableKey.plus(1), 1, json)
  return rows[0]
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
const eosVerifier = tableKey("verifier.ore")
module.exports = {
  findOne,
  getContractInstance,
  tableKey,
  eos
}