/* global ORE_NETWORK_URI:true */
/* global ORE_VERIFIER_ACCOUNT_KEY:true */
/* global ORE_VERIFIER_ACCOUNT_NAME:true */
/* global :true */

// const {
//     Orejs
// } = require('@open-rights-exchange/orejs');

const {
    orejs
} = require('../../src/ore')

const {
    mockRight
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

function mockGetTableRows(_orejs = undefined) {
    const mockupRight = jest.fn();

    const getRight = [JSON.parse(mockRight()[0])];

    mockupRight.mockReturnValue(getRight);
    const orejs = _orejs || constructOrejs;
    orejs.getAllTableRows = mockupRight;

    return getRight;
}

module.exports = {
    constructOrejs,
    mockGetTableRows
}