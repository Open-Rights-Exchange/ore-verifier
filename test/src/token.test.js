/* global VERIFIER_ACCOUNT_NAME=true */
/* global ORE_TESTA_ACCOUNT_NAME=true */
/* global CPU_CONTRACT_NAME=true */
/* global CPU_TOKEN_SYMBOL=true */

const {
    getBalance,
    getApprovalAmount
} = require('../../src/token');

const {
    orejs
} = require('../../src/ore')

const {
    mockGetBalance,
    mockGetTableRows
} = require('../helpers/ore')


describe('getBalance', () => {
    let cpuMockBalance;

    beforeEach(() => {
        cpuMockBalance = 30;
        mockGetBalance(orejs, cpuMockBalance);
    });

    it('returns the CPU balance of the account', async () => {
        cpuBalance = await getBalance(ORE_TESTA_ACCOUNT_NAME, CPU_TOKEN_SYMBOL, CPU_CONTRACT_NAME);
        expect(cpuBalance).toEqual(cpuMockBalance);
    });
});

describe('getApprovalAmount', () => {
    beforeEach(async () => {
        fetch.resetMocks();
    })

    it('returns approval amount for the verifier by the approving account', async () => {
        mockGetTableRows(orejs, "allowances", "1.0000 CPU");
        const allowance = await getApprovalAmount(VERIFIER_ACCOUNT_NAME, ORE_TESTB_ACCOUNT_NAME, CPU_CONTRACT_NAME, CPU_TOKEN_SYMBOL);
        expect(allowance).toEqual(1);
    });
    it('returns 0 if no amount is approved by the approving account', async () => {
        mockGetTableRows(orejs, "allowances");
        const allowance = await getApprovalAmount(VERIFIER_ACCOUNT_NAME, ORE_TESTA_ACCOUNT_NAME, CPU_CONTRACT_NAME, CPU_TOKEN_SYMBOL);
        expect(allowance).toEqual(0);
    });
})