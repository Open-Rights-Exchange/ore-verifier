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
    getParamRulesFromInstrument
} = require('../../src/instrument')

const {
    mockGetTableRows
} = require('../helpers/ore')

const {
    expectFetch,
    mock,
    mockInstrument,
    mockInstruments,
} = require('../helpers/fetch');

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

describe('checkAdditionalUrlParams', () => {
    beforeEach(async () => {
        fetch.resetMocks();
        mockGetTableRows(orejs, "tokens");
    })
    it('returns ', async () => {
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