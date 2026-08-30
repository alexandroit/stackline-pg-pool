'use strict'

const harness = require('./support/harness')

for (const file of [
  'connection-strings',
  'connection-timeout',
  'ending',
  'error-handling',
  'events',
  'idle-timeout',
  'index',
  'lifecycle-hooks',
  'lifetime-timeout',
  'logging',
  'max-uses',
  'releasing-clients',
  'sizing',
  'submittable',
  'verify'
]) {
  require(`./${file}.js`)
}

harness.run().catch((error) => {
  console.error(error.stack || error)
  process.exitCode = 1
})
