'use strict'

const harness = require('./support/harness')

require('./stackline-contract.test.js')

harness.run().catch((error) => {
  console.error(error.stack || error)
  process.exitCode = 1
})
