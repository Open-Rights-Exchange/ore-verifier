const {
  Orejs
} = require('@open-rights-exchange/orejs');

const verifierKey = process.env.VERIFIER_PRIVATE_KEY
const verifierAccount = process.env.VERIFIER_ACCOUNT_NAME
const oreNetworkUri = process.env.ORE_NETWORK_URI
const chainId = process.env.ORE_NETWORK_CHAINID

const orejs = new Orejs({
  httpEndpoint: oreNetworkUri,
  keyProvider: [verifierKey],
  orePayerAccountName: verifierAccount,
  sign: true,
  chainId: chainId,
})

module.exports = {
  orejs
}