/* global ORE_TESTA_ACCOUNT_NAME:true */
/* global ORE_TESTA_ACCOUNT_KEY:true */
/* global ORE_TESTB_ACCOUNT_NAME:true */
/* global ORE_TESTB_ACCOUNT_KEY:true */
/* global VERIFIER_ACCOUNT_NAME:true */
/* global ORE_NETWORK_URI:true */
/* global CPU_TOKEN_SYMBOL:true */
/* global CPU_CONTRACT_NAME:true */
/* global RIGHTS_REGISTRY_CONTRACT_NAME:true */
/* global LOG_CONTRACT_NAME:true */

const {
    verify,
    updateUsageLog
} = require('../../src/verifier')

const {
    orejs
} = require('../../src/ore')

const {
    mockGetAccountFromKey,
    mockGetTransaction,
    mockAction,
    mockOptions
} = require('../helpers/ore')

const ecc = require('eosjs-ecc')

describe('verify', () => {

    beforeEach(async () => {
        fetch.resetMocks();
        mockGetAccountFromKey(orejs, ORE_TESTA_ACCOUNT_NAME);
    })

    it('returns true if the signature matches the public key of the user account passed in', async () => {
        const signature = ecc.sign("1", ORE_TESTA_ACCOUNT_KEY) //here 1 is test instrument id
        const verified = await verify(signature, "1", ORE_TESTA_ACCOUNT_NAME)
        expect(verified).toEqual(true)
    })

    it('returns false if the signature does not match the public key of the user account', async () => {
        const signature = ecc.sign("1", ORE_TESTB_ACCOUNT_KEY)
        const verified = await verify(signature, 1, ORE_TESTB_ACCOUNT_NAME)
        expect(verified).toEqual(false)
    })
})

describe('verifier handler test cases', () => {
    it('returns an ore acess token if the voucher is active and owner has enough balance to call the API once', async () => {

    })
    test('returns request with error message if the user account does not have enough balance to make API calls', () => {})
    test('returns the request with error message if the approved amount from the user for the verifier is 0', () => {})
    test('returns request with error message if the instrument is inactive', () => {})
    test('jwt token is a valid token', () => {})
})

describe('cpu transfer', () => {
    beforeEach(() => {
        cpuBalance = 10;
        memo = "transfer CPU";
        transaction = mockGetTransaction(orejs);
        spyTransaction = jest.spyOn(orejs.eos, 'transact');
    });

    it('cpu.transferfrom transfers amountPerCall cpu from voucher\'s owner account to voucher\'s issuer account', async() => {
        const result = await orejs.transferCpufrom(ORE_OWNER_ACCOUNT_NAME, ORE_TESTA_ACCOUNT_NAME, cpuBalance, memo);
        expect(spyTransaction).toHaveBeenCalledWith({
            actions: [mockAction({
                account: 'token.ore',
                name: 'transferFrom',
            })]
        }, mockOptions());
    })
})

describe('update usage count', () => {
    beforeEach(() => {
        memo = "update usage log";
        rightName = "testright";
        accessToken = "testtoken";
        voucherId = 2;
        amount = 10;
        transaction = mockGetTransaction(orejs);
        spyTransaction = jest.spyOn(orejs.eos, 'transact');
    });
    it('calls the updatecount action on ORE chain. It also inserts a log into the logs table on the ore chain if the amount is greater than 0.', async() => {
        const result = await updateUsageLog(VERIFIER_ACCOUNT_NAME, LOG_CONTRACT_NAME, voucherId, rightName, accessToken, amount, updateLogs = true)
        expect(spyTransaction).toHaveBeenCalledTimes(2);
        expect(spyTransaction).toHaveBeenCalledWith({
            actions: [mockAction({
                account: 'usagelog.ore',
                name: 'createlog',
            })]
        }, mockOptions());
        expect(spyTransaction).toHaveBeenCalledWith({
            actions: [mockAction({
                account: 'usagelog.ore',
                name: 'updatecount',
            })]
        }, mockOptions());
        
    })

    it('calls the updatecount action on ORE chain and doesn\'t update the logs as the call cost is 0', async() => {
        const result = await updateUsageLog(VERIFIER_ACCOUNT_NAME, LOG_CONTRACT_NAME, voucherId, rightName, accessToken, amount = 0, updateLogs = false)
        expect(spyTransaction).toHaveBeenCalledTimes(1);
        expect(spyTransaction).toHaveBeenCalledWith({
            actions: [mockAction({
                account: 'usagelog.ore',
                name: 'createlog',
            })]
        }, mockOptions());      
    })
})