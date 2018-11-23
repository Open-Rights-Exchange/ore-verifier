/*
Includes functions to get data from the right registry 
*/
const eosJs = require("./eos.js")
const eos = eosJs.eos
const {
    encrypt
} = require("./helpers.js")

//get the right details from right table
async function getRight(rightName, rightContractName) {
    let right = null
    const rights = await eos.getTableRows({
        code: rightContractName,
        json: true,
        scope: rightContractName,
        table: 'rights',
        limit: -1
    })

    for (var i = 0; i < rights.rows.length; i++) {
        if (rights.rows[i]["right_name"] === rightName) {
            right = await rights.rows[i]
            return right
        }
    }
    return right
}

// returns the url parameters in the format they were passed in the client request 
function getOriginalParams(requestParams) {
    const urlParams = {}
    let newKey
    const requestKeys = Object.keys(requestParams)

    requestKeys.forEach(key => {
        if (key.startsWith("urlParam_")) {
            newKey = key.split("urlParam_")[1]
            urlParams[newKey] = requestParams[key]
        } else {
            urlParams[key] = requestParams[key]
        }
    })
    return urlParams
}

// return true if the matches_params with the url object from chain matches the request parameters 
function checkIfParamsMatch(rightParams, urlParams) {
    let exists = false
    let objKey

    const urlParamsKeys = Object.keys(urlParams)

    rightParams.forEach(obj => {
        objKey = obj["name"]
        if (urlParamsKeys.includes(objKey)) {
            if (encrypt(obj["value"]) === urlParams[objKey]) {
                exists = true
            } else {
                exists = false
                return exists
            }
        } else {
            exists = false
            return exists
        }
    })

    return exists
}

// gets the endpoint for a particular right based on the request params
async function getEndpoint(rightName, requestParams, rightContractName) {
    let defaultUrl = null
    const originalUrlParams = getOriginalParams(requestParams)
    const right = await getRight(rightName, rightContractName)

    if (right != null) {
        const urls = await right.urls

        //return the url for which matches_params values match the requestParam values
        const matchedEndpoints = urls.filter(url => {
            const {
                matches_params
            } = url
            if (url["is_default"] === 1) {
                defaultUrl = url
            }
            if (checkIfParamsMatch(matches_params, originalUrlParams) === true) {
                return url
            }
        })

        if (matchedEndpoints != undefined && matchedEndpoints.length != 0) {
            // array empty or does not exist
            return matchedEndpoints[0]
        } else {
            //return the default url if matches_params values do not match the requestParams values
            return defaultUrl
        }
    }
}

// get the url from the endpoint object along with the default values from the parameter rules of the instrument attached
function getUrl(endpoint, requestParams, parameterRules) {
    let {
        defaultVal
    } = parameterRules
    let url = new URL(endpoint.url)
    let additionalParams = {}
    let requestKeys = Object.keys(requestParams)
    let encryptedParams = JSON.parse(JSON.stringify(requestParams))

    defaultVal.map(obj => {
        // return the default parameter values from the parameter rules if those keys are not present in the client request initially
        if (!requestKeys.includes(obj.name)) {
            additionalParams[obj.name] = obj.value
            encryptedParams[obj.name] = encrypt(obj.value)
        }
    })

    return {
        url,
        additionalParams,
        encryptedParams
    }
}

// return back an url object by recursively resolving the base right
async function resolveEndpoint(rightName, requestParams, rightContractName) {
    const finalEndpoint = [];
    var endpoint = await getEndpoint(rightName, requestParams, rightContractName)
    var baseRight = endpoint.base_right
    finalEndpoint.push(endpoint.url)

    while (baseRight != "") {
        baseEndpoint = await getEndpoint(endpoint.base_right, requestParams, rightContractName)
        baseRight = baseEndpoint.base_right
        finalEndpoint.push(baseEndpoint.url)
    }

    endpoint.url = finalEndpoint.reverse().join("")
    return endpoint
}

module.exports = {
    getRight,
    resolveEndpoint,
    getEndpoint,
    getUrl
}