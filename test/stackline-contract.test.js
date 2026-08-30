'use strict'

const assert = require('node:assert/strict')
const { describe, it } = require('./support/harness')
const packageJson = require('../package.json')
const Pool = require('../index.js')

class TestClient {
  constructor(options) {
    this.options = options
  }
}

describe('Stackline package contract', () => {
  it('preserves the pg-pool constructor export', () => {
    assert.equal(typeof Pool, 'function')
    assert.equal(Pool.name, 'Pool')
  })

  it('accepts an injected Client without resolving an external driver', () => {
    const pool = new Pool({ Client: TestClient, max: 3 })
    assert.equal(pool.Client, TestClient)
    assert.equal(pool.options.max, 3)
    assert.equal(pool.totalCount, 0)
  })

  it('does not auto-install the historical pg dependency chain', () => {
    assert.deepEqual(packageJson.dependencies, undefined)
    assert.deepEqual(packageJson.peerDependencies, undefined)
    assert.deepEqual(packageJson.optionalDependencies, undefined)
  })
})
