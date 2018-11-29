const {
    getBalance,
    getApprovalAmount
} = require('../../src/token');

const {
    constructOrejs,
    mockGetTransaction
} = require('../helpers/ore')

const {
    mock
} = require('../helpers/fetch')


describe('getBalance', () => {
    let cpuMockBalance;

    beforeEach(() => {
        cpuMockBalance = 30;

        fetch.resetMocks();
        fetch.mockResponses(mock([`${cpuMockBalance}.0000 ${CPU_TOKEN_SYMBOL}`]));
    });

    it('returns the CPU balance of the account', async () => {
        cpuBalance = await getBalance(ORE_TESTA_ACCOUNT_NAME, CPU_TOKEN_SYMBOL, CPU_CONTRACT_NAME);
        expect(cpuBalance).toEqual(cpuMockBalance);
    });

    it('returns 0 if CPU balance of the account is 0', async () => {
        const balance = await getBalance(INSTRUMENT_CONTRACT_NAME, CPU_TOKEN_SYMBOL, CPU_CONTRACT_NAME);
        expect(balance).toEqual(0)
    });
});

describe('getApprovalAmount', () => {
    beforeAll(() => {
        orejs = constructOrejs({
            fetch
        });
    });

    it('returns approval amount for the verifier by the approving account', async () => {
        const allowance = await getApprovalAmount(VERIFIER_ACCOUNT_NAME, ORE_TESTB_ACCOUNT_NAME, CPU_CONTRACT_NAME, CPU_TOKEN_SYMBOL);
        expect(allowance).toEqual(1);
    });
    it('returns 0 if no amount is approved by the approving account', async () => {
        const allowance = await getApprovalAmount(VERIFIER_ACCOUNT_NAME, ORE_TESTA_ACCOUNT_NAME, CPU_CONTRACT_NAME, CPU_TOKEN_SYMBOL);
        expect(allowance).toEqual(0);
    });
})