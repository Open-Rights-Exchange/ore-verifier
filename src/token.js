/*
Includes functions get token balance and approved token amount to be spent by the verifier
*/
const eosJs = require("./eos.js")
const eos = eosJs.eos
const tableKey = eosJs.tableKey
const findOne = eosJs.findOne

// get balance of an account for a given token symbol
function getTokenAmount(tokenAmount, tokenSymbol) {
    try {
        if (typeof tokenAmount === "number") {
            const amount = parseFloat(tokenAmount).toFixed(4)
            return amount.toString() + " " + tokenSymbol
        } else if (typeof tokenAmount === "string") {
            if (tokenAmount.split(" ")[1] === tokenSymbol) {
                return tokenAmount
            } else {
                return parseFloat(tokenAmount).toFixed(4).toString() + " " + tokenSymbol
            }
        } else {
            throw err
        }
    } catch (err) {
        console.info(err)
    }
}

// get the amount approved for the verifier by the owner
async function getApprovalAmount(verifier, owner, cpuContractName, cpuTokenSymbol) {
    let approvedAmount = 0
    const eosVerifier = tableKey(verifier)
    const allowance = await findOne(cpuContractName, owner, 'allowances', eosVerifier)
    if (allowance != undefined) {
        approvedAmount = allowance["quantity"].split(cpuTokenSymbol)[0]
    }
    return parseFloat(approvedAmount)
}

async function getBalance(accountName, cpuContractName, cpuTokenSymbol) {

    const balance = await eos.getCurrencyBalance(cpuContractName, accountName, cpuTokenSymbol)
    if (balance) {
        return balance[0].split(cpuTokenSymbol)[0]
    }
    return 0
}

module.exports = {
    getTokenAmount,
    getBalance,
    getApprovalAmount
}