/* global ORE_NETWORK_URI:true */
/* global ORE_VERIFIER_ACCOUNT_KEY:true */
/* global ORE_VERIFIER_ACCOUNT_NAME:true */
/* global ORE_TESTA_ACCOUNT_NAME: true */
/* global :true */

// const {
//     Orejs
// } = require('@open-rights-exchange/orejs');

const {
    orejs
} = require('../../src/ore')

const {
    mockRight,
    mockApprovedAccounts,
    mockAccountFromKey,
    mockInstruments
} = require('../helpers/fetch')

function constructOrejs(config) {
    const orejs = new Orejs({
        httpEndpoint: ORE_NETWORK_URI,
        keyProvider: [ORE_VERIFIER_ACCOUNT_KEY],
        orePayerAccountName: ORE_VERIFIER_ACCOUNT_NAME,
        sign: true,
        ...config,
    });

    return orejs;
}

function mockGetBalance(_orejs = undefined, _currency = '1.0000 CPU') {
    const mockupCurrency = jest.fn();

    const getCurrency = _currency;
    mockupCurrency.mockReturnValue(getCurrency);
    const orejs = _orejs || constructOrejs();
    orejs.getBalance = mockupCurrency;

    return getCurrency;
}

function mockGetTableRows(_orejs = undefined, table = "accounts", _approvedAmount = "0.0000 CPU") {
    let getRows;
    const mockUpTableRows = jest.fn();
    if (table == "rights") {
        getRows = [JSON.parse(mockRight()[0])];
    } else if (table == "allowances") {
        getRows = [JSON.parse(mockApprovedAccounts(_approvedAmount)[0])];
    } else if (table == "tokens") {
        let instrument1 = {
            owner: ORE_TESTA_ACCOUNT_NAME,
        };
        let instrument2 = {
            owner: ORE_TESTA_ACCOUNT_NAME,
            end_time: Math.floor(Date.now() / 1000) - 10,
        };
        let instrument3 = {
            owner: ORE_TESTA_ACCOUNT_NAME,
            instrument: {
                instrument_class: 'company.uncategorized',
            },
        };
        let instrument4 = {
            owner: ORE_TESTA_ACCOUNT_NAME,
            instrument: {
                instrument_class: 'company.uncategorized',
                rights: [{
                    right_name: 'company.nobody.licenseApi',
                }],
            },
        };

        instrumentMocks = mockInstruments([
            instrument1,
            instrument2,
            instrument3,
            instrument4
        ]);
        getRows = JSON.parse(instrumentMocks[0]).rows;
    }

    mockUpTableRows.mockReturnValue(getRows);
    const orejs = _orejs || constructOrejs;
    orejs.getAllTableRows = mockUpTableRows;

    return getRows;
}

function mockGetAccount(_orejs = undefined, _account = {}) {
    const mockupAccount = jest.fn();

    const getAccount = JSON.parse(mockAccount(_account)[0])[0];

    mockupAccount.mockReturnValue(getAccount);
    const orejs = _orejs || constructOrejs();
    orejs.eos.rpc.get_account = mockupAccount;

    return getAccount;
}

function mockGetAccountFromKey(_orejs = undefined, _account = ORE_TESTA_ACCOUNT_NAME) {
    const mockupAccount = jest.fn();

    const getAccount = JSON.parse(mockAccountFromKey(_account)[0]);

    mockupAccount.mockReturnValue(getAccount);
    const orejs = _orejs || constructOrejs();
    orejs.eos.rpc.history_get_key_accounts = mockupAccount;

    return getAccount;
}

module.exports = {
    constructOrejs,
    mockGetBalance,
    mockGetTableRows,
    mockGetAccountFromKey
}