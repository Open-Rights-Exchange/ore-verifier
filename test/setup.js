global.fetch = require('jest-fetch-mock');

// The following account keys are not used in production...

// global.ORE_NETWORK_URI = 'http://127.0.0.1:8888';
global.ORE_NETWORK_URI = 'https://ore-staging.openrights.exchange:443';
global.CPU_CONTRACT_NAME = "token.ore";
global.CPU_TOKEN_SYMBOL = "CPU";
global.RIGHTS_REGISTRY_CONTRACT_NAME = "rights.ore"
global.INSTRUMENT_CONTRACT_NAME = "instr.ore"
global.ORE_OWNER_ACCOUNT_NAME = 'app.apim';
global.ORE_OWNER_ACCOUNT_KEY = '5KfG8q2i81kDtyLxzDnJ8rz95cztiL2HVPAkuqRUBRiMehh9pfu';
global.ORE_PAYER_ACCOUNT_NAME = 'verifier.ore';
global.ORE_PAYER_ACCOUNT_KEY = '5Hr33yizEQe4GLebNtVwPq8AvzqWcrH4GJT3RAjjfe71pcVBFdv';
global.ORE_TESTA_ACCOUNT_NAME = 'test1.apim';
global.ORE_TESTA_ACCOUNT_KEY = '5KecUJG87uPfeRoYgHKfHnqxPKGUDWdbM9qxWjP2hjGMXVN13ng';
global.ORE_TESTB_ACCOUNT_NAME = 'test2.apim';
process.env.ORE_NETWORK_URI = "https://ore-staging.openrights.exchange:443";
process.env.ORE_NETWORK_CHAINID = "a6df478d5593b4efb1ea20d13ba8a3efc1364ee0bf7dbd85d8d756831c0e3256";
process.env.VERIFIER_ACCOUNT_NAME = 'verifier.ore';
process.env.VERIFIER_PRIVATE_KEY = '5Hr33yizEQe4GLebNtVwPq8AvzqWcrH4GJT3RAjjfe71pcVBFdv';

// global.ORE_NETWORK_CHAINID = 'a6df478d5593b4efb1ea20d13ba8a3efc1364ee0bf7dbd85d8d756831c0e3256';
// global.VERIFIER_PRIVATE_KEY = '5Hr33yizEQe4GLebNtVwPq8AvzqWcrH4GJT3RAjjfe71pcVBFdv';
// global.VERIFIER_ACCOUNT_NAME = 'verifier.ore';
// global.ORE_VERIFIER_ACCOUNT_KEY = '5Hr33yizEQe4GLebNtVwPq8AvzqWcrH4GJT3RAjjfe71pcVBFdv';
// global.ORE_VERIFIER_ACCOUNT_NAME = 'verifier.ore';