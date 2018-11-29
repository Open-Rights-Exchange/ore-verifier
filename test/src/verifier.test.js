/* global ORE_TESTA_ACCOUNT_NAME:true */
/* global ORE_NETWORK_URI:true */
/* global CPU_TOKEN_SYMBOL:true */
/* global CPU_CONTRACT_NAME:true */
/* global RIGHTS_REGISTRY_CONTRACT_NAME:true */
const {
    getInstrument,
    getRightFromInstrument,
    getEndpoint,
    checkVerifier,
    getApprovalAmount,
    verify,
    handlerFor,
} = require('../../src/verifier')

const {
    mockRight,
    mockAdditionalParams,
    mockEndpointObject,
} = require('../helpers/fetch')

describe('checkVerifier', () => {
    test('valid verifier account', () => {})
    test('invalid verifier account', () => {})
})

describe('getInstrument', () => {
    test('returns the error message if ', () => {})
    test('returns the instrument corresponding to the instrument id passed in', () => {})

})

describe('getRightFromInstrument', () => {
    test('returns the right object with the required right name', () => {})
})

describe('verify', () => {
    test('returns true if the signature matches the public key of the user account passed in')
    test('returns false if the signature does not match the public key of the user account')
    test('returns false if invalid signature')
})

describe('verifier handler test cases', () => {
    test('returns an ore acess token if the voucher is active and owner has enough balance to call the API once', () => {})
    test('returns request with error message if the user account does not have enough balance to make API calls', () => {})
    test('returns the request with error message if the approved amount from the user for the verifier is 0', () => {})
    test('returns request with error message if the instrument is inactive', () => {})
    test('jwt token is a valid token', () => {})
})

describe('cpu transfer', () => {
    test('cpu.transferfrom transfers amountPerCall cpu from voucher\'s owner account to voucher\'s issuer account', () => {})
    test('cpu transfer confirmed on the chain', () => {})
})

describe('update usage count', () => {
    test('the usagelog table count increaments after the updatecount action', () => {})
    test('return true if the updatecount action is confirmed on the chain', () => {})
    test('return f')
})