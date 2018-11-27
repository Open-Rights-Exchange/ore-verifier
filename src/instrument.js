/*
includes all instrument related functions
*/
// const eosJs = require("./eos.js")
// const eos = eosJs.eos
const {
    getAllTableRows,
    eos
} = require("./eos.js")
const {
    encrypt
} = require("./helpers.js")

async function getInstrument(instrumentId, instrumentContractName) {
    let instrument = null
    const instruments = await getAllTableRows({
        code: instrumentContractName,
        scope: instrumentContractName,
        table: 'tokens',
        limit: -1
    })

    for (var i = 0; i < instruments.length; i++) {

        if (instruments[i]["id"] === instrumentId) {
            return instruments[i]
        }
    }
    return instrument
}

//gets right from the instrument which the owner purchased
async function getRightFromInstrument(instrumentData, rightName) {
    let right = null
    const rights = instrumentData["instrument"]["rights"]

    for (var i = 0; i < rights.length; i++) {
        if (rights[i]["right_name"] === rightName) {
            right = rights[i]
            return right
        }
    }
    return right
}

// get the additioanl url params from the right
function getAdditionalUrlParams(right) {
    const additionalUrlParams = []
    let rightParams = right["additional_url_params"]
    rightParams = JSON.parse(rightParams)

    rightParams.map(function (a) {
        const params = a.params
        const val = {}
        params.map(function (obj) {
            val[obj["name"]] = obj["value"]
        })
        return additionalUrlParams.push(val)
    })
    return additionalUrlParams
}

// rule engine to check if the request parameters matches any of the additioanl url params records in the right
function checkAdditionalUrlParams(instrumentParams, requestParams, right) {
    let additionalParamKeys
    let matches
    let existingRight = []
    const {
        required,
        locked
    } = instrumentParams

    const additionalUrlParams = getAdditionalUrlParams(right)
    const requestKeys = Object.keys(requestParams)
    required.forEach(param => {
        if (!requestKeys.includes(param)) {
            throw new Error("required parameter " + param + " not found in the request")
        }
    })

    additionalUrlParams.forEach(function (additionalUrlParam) {
        additionalParamKeys = Object.keys(additionalUrlParam)
        matches = 0

        additionalParamKeys.forEach(function (key) {
            if (requestKeys.includes(key)) {
                if (encrypt(additionalUrlParam[key]) === requestParams[key]) {
                    matches += 1
                    return matches
                } else {
                    matches -= 1
                    return matches
                }
            } else {
                matches -= 1
                return matches
            }
        })

        if (matches === additionalParamKeys.length) {
            locked.forEach(key => {
                if (requestKeys.includes(key) && !additionalParamKeys.includes(key)) {
                    throw new Error("value of the locked parameters " + key + " for the right cannot be changed.")
                }
            })
            existingRight.push(additionalUrlParam)
        }
    })
    if (existingRight.length != 0) {
        return true
    }
    return false
}

// check the parameter rules
function getParamRulesFromInstrument(parameterRules) {
    const required = []
    const locked = []
    const defaultVal = []

    parameterRules.map(function (a) {
        if (a.type === "required") {
            a.values.map(function (val) {
                required.push(val.name)
            })
        } else if (a.type === "locked") {
            a.values.map(function (val) {
                locked.push(val.name)
            })
        } else if (a.type === 'default') {
            a.values.map(function (val) {
                defaultVal.push(val)
            })
        }
    })

    return {
        required,
        locked,
        defaultVal
    }
}

// check if a valid instrument
function checkValidInstrument(instrument) {
    if (instrument.revoked == 1) {
        return new Error("voucher is revoked and cannot be used")
    }
}

module.exports = {
    getInstrument,
    checkValidInstrument,
    getRightFromInstrument,
    checkAdditionalUrlParams,
    getParamRulesFromInstrument
}