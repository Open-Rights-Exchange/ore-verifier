console.log('loading env.js')

const {
    ORE_NETWORK_URI = "https://ore-staging.openrights.exchange:443",
        ORE_NETWORK_CHAINID = "a6df478d5593b4efb1ea20d13ba8a3efc1364ee0bf7dbd85d8d756831c0e3256",
        VERIFIER_ACCOUNT_NAME = 'verifier.ore',
        VERIFIER_PRIVATE_KEY = '5Hr33yizEQe4GLebNtVwPq8AvzqWcrH4GJT3RAjjfe71pcVBFdv',

} = process.env;

const ENV = {
    ORE_NETWORK_URI,
    ORE_NETWORK_CHAINID,
    VERIFIER_ACCOUNT_NAME,
    VERIFIER_PRIVATE_KEY
};

module.exports.ENV = ENV;