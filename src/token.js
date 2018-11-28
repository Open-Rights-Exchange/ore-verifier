/*
Includes functions get token balance and approved token amount to be spent by the verifier
*/
const {
    orejs
} = require("./ore.js")

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
    const allowance = await orejs.getAllTableRows({
        code: cpuContractName,
        scope: owner,
        table: 'allowances',
        lower_bound: verifier,
    })

    if (allowance != undefined && allowance.length != 0) {
        approvedAmount = allowance[0]["quantity"].split(cpuTokenSymbol)[0]
    }

    return parseFloat(approvedAmount)
}

async function getBalance(accountName, tokenSymbol, contractName) {
    const balance = await orejs.getBalance(accountName, tokenSymbol, contractName)
    return balance
}

module.exports = {
    getTokenAmount,
    getBalance,
    getApprovalAmount
}