/* global ORE_OWNER_ACCOUNT_NAME:true */
/* global ORE_TESTA_ACCOUNT_NAME:true */
/* global ORE_NETWORK_URI:true */
/* global INSTRUMENT_CONTRACT_NAME:true */


const {
    orejs
} = require('../../src/ore')

const {
    getInstrument,
    getRightFromInstrument,
    getParamRulesFromInstrument,
    checkAdditionalUrlParams
} = require('../../src/instrument')

const {
    mockGetTableRows
} = require('../helpers/ore')

describe('getInstrument', () => {
    beforeEach(async () => {
        fetch.resetMocks();
        mockGetTableRows(orejs, "tokens");
    })
    it('returns the instrument with the instrument id passed in', async () => {
        const instrument = await getInstrument(1, INSTRUMENT_CONTRACT_NAME)
        expect(instrument.id).toEqual(1)
    })
    it('returns null if instrument not found', async () => {
        const instrument = await getInstrument(100, INSTRUMENT_CONTRACT_NAME)
        expect(instrument).toBeNull
    })
})

describe('getRightFromInstrument', () => {
    beforeEach(async () => {
        fetch.resetMocks();
        mockGetTableRows(orejs, "tokens");
    })
    it('returns the right object with the required right name', async () => {
        const instrument = await getInstrument(1, INSTRUMENT_CONTRACT_NAME)
        const right = await getRightFromInstrument(instrument, 'apimarket.manager.licenseApi')
        expect(right.right_name).toEqual('apimarket.manager.licenseApi')
    })
    it('returns null if the right is not found in the instrument', async () => {
        const instrument = await getInstrument(1, INSTRUMENT_CONTRACT_NAME)
        const right = await getRightFromInstrument(instrument, 'non existing right')
        expect(right).toBeNull
    })
})

describe('getParamRulesFromInstrument', () => {
    beforeEach(async () => {
        fetch.resetMocks();
        mockGetTableRows(orejs, "tokens");
    })
    it('returns the parameter rules into json format', async () => {
        const instrument = await getInstrument(1, INSTRUMENT_CONTRACT_NAME);
        const parameterRules = await getParamRulesFromInstrument(instrument.instrument.parameter_rules);
        expect(parameterRules.required).toEqual(['appId'])
        expect(parameterRules.locked).toEqual(['userAccount'])
        expect(parameterRules.defaultVal).toEqual([{
            name: 'language',
            value: 'en-us'
        }])
    })
})

describe('checkAdditionalUrlParams', () => {
    beforeEach(async () => {
        fetch.resetMocks();
        mockGetTableRows(orejs, "tokens");
    })

    it('returns true if the request parameters matches any of the additioanl url params records in the right', async () => {
        const requestParams = {
            imageurl: '92b2e84629673935f5377f58817d9120fc65731701d0a4f5505105eae72ebc77',
            appId: 'd4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35',
            userAccount: '273bb8988bc9eff3f945e81f4f9caee5d8e67d785b4078773e39ca84fc99f9b6',
            scope: 'e59f9deedcc8f44cd3443857b2a4fd210f8bbba3d85308ff87194fb928bb81f4'
        }
        const instrument = await getInstrument(1, INSTRUMENT_CONTRACT_NAME);
        const parameterRules = await getParamRulesFromInstrument(instrument.instrument.parameter_rules);
        const validParams = await checkAdditionalUrlParams(parameterRules, requestParams, instrument.instrument.rights[0])
        expect(validParams).toEqual(true)
    })

    it('returns error if the request parameters are missing the required values from the parameter rules', async () => {
        const requestParams = {
            imageurl: '92b2e84629673935f5377f58817d9120fc65731701d0a4f5505105eae72ebc77',
            userAccount: '273bb8988bc9eff3f945e81f4f9caee5d8e67d785b4078773e39ca84fc99f9b6',
            scope: 'e59f9deedcc8f44cd3443857b2a4fd210f8bbba3d85308ff87194fb928bb81f4'
        }
        const instrument = await getInstrument(1, INSTRUMENT_CONTRACT_NAME);
        const parameterRules = await getParamRulesFromInstrument(instrument.instrument.parameter_rules);
        try {
            await checkAdditionalUrlParams(parameterRules, requestParams, instrument.instrument.rights[0])
        } catch (e) {
            expect(e.message).toMatch("required parameter appId not found in the request");
        }
    })
})