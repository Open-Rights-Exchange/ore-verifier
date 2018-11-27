require('dotenv').config()
const ecc = require('eosjs-ecc')
const jwt = require('jsonwebtoken')
const sortJson = require('sort-json')
const uuidv1 = require('uuid/v1')
const {
  eos,
  transact
} = require("./eos.js")
const {
  getInstrument,
  getRightFromInstrument,
  checkAdditionalUrlParams,
  getParamRulesFromInstrument
} = require('./instrument')
const {
  resolveEndpoint,
  getUrl
} = require('./rights')
const {
  log
} = require('./logging')
const {
  getTokenAmount,
  getApprovalAmount,
  getBalance
} = require('./token')

let errMsg = ''
let errorHead = 'Error from verifier'

//check if the public key belongs to the account provided
async function checkPubKeytoAccount(account, publicKey) {

  const keyaccounts = await eos.rpc.history_get_key_accounts(publicKey)
  const accounts = await keyaccounts["account_names"]

  return accounts.includes(account)
}

// check if the private key of the verifier service belongs to the actual trusted verifier account
async function checkVerifier(verifier, privateKey) {

  const publicKey = await ecc.privateToPublic(privateKey)
  const result = await checkPubKeytoAccount(verifier, publicKey)
  return result
}

async function verify(signature, instrumentId, owner) {

  const publicKey = ecc.recover(signature, instrumentId.toString())
  const result = await checkPubKeytoAccount(owner, publicKey)
  return result
}

// update the usage log on the ore blockchain 
async function updateUsageLog(verifier, logContractName, voucherId, rightName, accessToken, amount = 0, updateLogs = true) {
  let actions = []
  let errMsg

  const timestamp = Date.now()
  const accessTokenHash = ecc.sha256(accessToken)

  if (updateLogs === true) {
    actions = [{
      account: logContractName,
      name: 'createlog',
      authorization: [{
        actor: verifier,
        permission: 'active',
      }],
      data: {
        instrument_id: voucherId,
        right_name: rightName,
        token_hash: accessTokenHash,
        timestamp
      }
    }]

    try {
      (async () => {
        const logUpdateReciept = await transact(actions)
      })()
    } catch (error) {
      errMsg = "Error while updating the logs for" + rightName + "right of instrument id" + voucherId + "on the ORE blockchain."
      if (error instanceof RpcError) {
        throw new Error(errMsg + JSON.stringify(error.json, null, 2))
      }
      throw new Error(errMsg)
    }
  }

  actions = [{
    account: logContractName,
    name: 'updatecount',
    authorization: [{
      actor: verifier,
      permission: 'active',
    }],
    data: {
      instrument_id: voucherId,
      right_name: rightName,
      cpu: amount,
    }
  }]

  try {
    (async () => {
      const usageCountUpdateReciept = await transact(actions)
    })()
  } catch (error) {
    errMsg = "Error while updating the usage count for" + rightName + "right of instrument id" + voucherId + "on the ORE blockchain."
    if (error instanceof RpcError) {
      throw new Error(errMsg + JSON.stringify(error.json, null, 2))
    }
    throw new Error(errMsg)
  }


  log("transaction id for Api call count updates for voucher " + voucherId + " of " + owner + " ", usageCountUpdateReciept.transaction_id)
}

// main handler for the verifier to verify an incoming set of client proofs
const verifyHandler = (verifier, privateKey, verifierPrivateKey, instrumentContractName, rightContractName, cpuContractName, cpuTokenSymbol, logContractName) => {
  let tokenLifeSpan, amountPerCall, ownerBalance, approvalAmount
  let voucherCache = {}
  let parameterRules = []
  let endpoint = null
  let startTime, endTime, currentTime
  let verified
  let right
  let urlObj, url, additionalParams, encryptedUrlParams

  return async (req, res, next) => {
    var {
      voucherId,
      rightName,
      signature,
      requestParams
    } = req.body

    let voucher
    const cachedVoucher = voucherCache[voucherId]

    // check if the verifier is authorized
    try {
      const isAuth = await checkVerifier(verifier, privateKey)

      if (!isAuth) {
        errMsg = "Not an authorized verifier. Make sure the VERIFIER_PRIVATE_KEY belongs to VERIFIER_ACCOUNT_NAME in the env."
        throw new Error(errMsg)
      }

      // this map caches voucher instrument lookups by address
      if (cachedVoucher) {
        voucher = cachedVoucher
      } else {
        voucher = await getInstrument(voucherId, instrumentContractName)
        if (voucher == null) {
          errMsg = "The voucher id passed in doesn't belong to the user."
          throw new Error(errMsg)
        }
      }
      voucherCache[voucherId] = voucher
    } catch (error) {
      return res.status(401).json({
        message: `${errorHead}:${error.message}`
      })
    }

    // validate that the user can access the right 
    try {
      // get the right from the instrument
      right = await getRightFromInstrument(voucher, rightName)

      if (right === null) {
        errMsg = "right doesn\'t exist in the voucher. Make sure the user holds a voucher for the requested right."
        throw new Error(errMsg)
      }

      // get the parameter rules
      parameterRules = await getParamRulesFromInstrument(voucher["instrument"]["parameter_rules"])

      if (right["additional_url_params"].length != 0) {
        if (!checkAdditionalUrlParams(parameterRules, requestParams, right)) {
          errMsg = "request parameters do not match any of the rights in the voucher. Makes sure that the request parameters match at least one of the additional_url_param in the rights of the voucher."
          throw new Error(errMsg)
        }
      }
    } catch (error) {
      return res.status(401).json({
        message: `${errorHead}:${error.message}`
      })
    }

    // get the url 
    try {
      // get the endpoint from the instrument
      endpoint = await resolveEndpoint(rightName, requestParams, rightContractName)

      if (endpoint === null) {
        errMsg = "no endpoint exist for the passed in additonal_url_params"
        throw new Error(errMsg)
      }

      // get the url from the endpoint object along with the default values from the parameter rules of the instrument
      urlObj = await getUrl(endpoint, requestParams, parameterRules)
      url = urlObj['url']
      additionalParams = urlObj['additionalParams']
      encryptedUrlParams = urlObj['encryptedParams']
    } catch (error) {
      return res.status(401).json({
        message: `${errorHead}:${error.message}`
      })
    }

    // get voucher specific details
    try {
      // get token life span for jwt
      tokenLifeSpan = await endpoint["token_life_span"]

      // get the amountPerCall from the instrument
      amountPerCall = right["price_in_cpu"]

      owner = voucher["owner"]

      issuer = voucher["instrument"]["issuer"]

      // start_time and end_time are moved to the root level of the instrument and are no longer within the instrument_data
      startTime = voucher["start_time"]

      endTime = voucher["end_time"]

      currentTime = Math.floor(Date.now() / 1000)

      ownerBalance = await getBalance(owner, cpuContractName, cpuTokenSymbol)
      approvalAmount = await getApprovalAmount(verifier, owner, cpuContractName, cpuTokenSymbol)
    } catch (error) {
      return res.status(401).json({
        message: `${errorHead}:${error.message}`
      })
    }

    try {
      verified = await verify(signature, voucherId, owner)
      if (verified) {
        // NOTE: we need to check both ownerBalance and approvalAmount as the verifier might be approved to pay on behalf of the api user but the api user might not have enough balance
        if ((ownerBalance >= parseFloat(amountPerCall) && approvalAmount >= parseFloat(amountPerCall) && currentTime > startTime) && (currentTime < endTime || endTime == 0)) {
          const sortedUrlParams = sortJson(encryptedUrlParams)
          const reqParamHash = ecc.sha256(JSON.stringify(sortedUrlParams))
          const payload = {
            endpoint,
            reqParamHash
          }
          const jwtToken = jwt.sign(payload, verifierPrivateKey, {
            algorithm: 'ES256',
            expiresIn: tokenLifeSpan
          })

          res.json({
            "oreAccessToken": jwtToken,
            "endpoint": url,
            "method": endpoint["method"],
            "additionalParameters": additionalParams,
            "accessTokenTimeout": tokenLifeSpan,
          })

          const amount = await getTokenAmount(amountPerCall, cpuTokenSymbol)

          if (amount != "0.0000 CPU") {
            const memo = amount + " transfer from " + owner + " to " + issuer + uuidv1()
            const actions = [{
              account: cpuContractName,
              name: 'transferfrom',
              authorization: [{
                actor: verifier,
                permission: 'active',
              }],
              data: {
                sender: verifier,
                from: owner,
                to: issuer,
                quantity: amount,
                memo
              }
            }]
            const cpuTransactionReciept = await transact(actions)
            log("transaction id for cpu transfer from " + owner + " to " + issuer + " ", cpuTransactionReciept.transaction_id)
          }
          updateUsageLog(verifier, logContractName, voucherId, rightName, JSON.stringify(jwtToken), amount)
        } else {
          errMsg = "The user account doesnt have enough balance for the api call."
          throw new Error(errMsg)
        }
      } else {
        errMsg = "The voucher id in the request is not signed by its authorized user."
        throw new Error(errMsg)
      }
    } catch (error) {
      return res.status(401).json({
        message: `${errorHead}:${error.message}`
      })
    }
  }
}


const usageHandler = (verifier, privateKey, logContractName) => {
  //handler for updating the usage logs on the ORE blockchain
  // NOTE: this handler only updates the total call count against an instrument for a particular right
  // NOTE: it doesn't log usage in the logs table for the free API calls
  let errMsg
  return async (req, res, next) => {
    try {
      const isAuth = await checkVerifier(verifier, privateKey)
      if (!isAuth) {
        errMsg = "Not an authorized verifier. Make sure the VERIFIER_PRIVATE_KEY belongs to VERIFIER_ACCOUNT_NAME in the env."
        throw new Error(errMsg)
      }

      var {
        voucherId,
        rightName,
        oreAccessToken,
        signature,
        amount
      } = req.body

      if (amount != "0.0000 CPU") {
        errMsg = "This endpoint can only be called for API calls with 0 cost."
        throw new Error(errMsg)
      }

      const verified = await verify(signature, voucherId, owner)

      if (!verified) {
        errMsg = "The voucher id in the request is not signed by its authorized user."
        throw new Error(errMsg)
      }

      updateUsageLog(verifier, logContractName, voucherId, rightName, oreAccessToken, amount, false)
      res.status(200).send()
    } catch (error) {
      return res.status(401).json({
        message: `${errorHead}:${error.message}`
      })
    }
  }
}

module.exports = {
  checkPubKeytoAccount,
  checkVerifier,
  verify,
  verifyHandler,
  usageHandler
}