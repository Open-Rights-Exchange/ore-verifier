require('dotenv').config()
require('newrelic')
const express = require('express')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const {
  URL
} = require('url')
const fetch = require('node-fetch')
const _ = require('lodash')
const verifierHandle = require('./src/verifier')
const fs = require('fs')
const cors = require('cors');

const getPath = (endpoint) => {
  return new URL(endpoint).pathname
}

const buildServer = ({}) => {
  const verifyHandler = verifierHandle.verifyHandler(verifier, privateKey, verifierPrivateKey, instrumentContractName, rightContractName, cpuContractName, cpuTokenSymbol, logContractName)
  const usageHandler = verifierHandle.usageHandler(verifier, privateKey, logContractName)
  const app = express()

  app.use(cors());
  app.options('*', cors())
  app.use(logger('dev'))
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({
    extended: false
  }))
  app.use(cookieParser())
  app.get('/healthcheck', (req, res) => {
    res.status(200).send()
  })

  // Returns the endpoint to access blockchain
  app.get('/discovery', (req, res) => {
    const oreNetworkUri = process.env.ORE_NETWORK_URI
    if (oreNetworkUri != null) {
      res.status(200)
      res.json({
        oreNetworkUri
      })
    } else {
      res.status(500)
      res.json({
        message: "ore network uri not found"
      })
    }
  })

  app.post(`/verify`, verifyHandler)
  app.post(`/update-usage`, usageHandler)

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    var err = new Error('Not Found')
    err.status = 404
    next(err)
  })

  // error handler
  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.json({
      message: err.message,
      error: err
    })
  })

  const server = require('http').createServer(app);

  return server
}

const port = process.env.VERIFIER_PORT || 3404

//verifier account 
const verifier = process.env.VERIFIER_ACCOUNT_NAME
const privateKey = process.env.VERIFIER_PRIVATE_KEY
const verifierPrivateKey = process.env.VERIFIER_PEM_PRIVATE_KEY.replace(/\\n/g, '\n')
const instrumentContractName = process.env.INSTRUMENT_CONTRACT_NAME
const rightContractName = process.env.RIGHTS_REGISTRY_CONTRACT_NAME
const cpuContractName = process.env.CPU_CONTRACT_NAME
const cpuTokenSymbol = process.env.CPU_TOKEN_SYMBOL
const logContractName = process.env.USAGE_LOG_CONTRACT_NAME

const run = async () => {

  const server = buildServer({
    verifier,
    privateKey,
    verifierPrivateKey,
    instrumentContractName,
    rightContractName,
    cpuContractName,
    cpuTokenSymbol,
    logContractName
  })
  server.listen(port, () => console.log(`listening on ${port}...`))
}

run()