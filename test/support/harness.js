'use strict'

const timeoutMillis = Number(process.env.TEST_TIMEOUT || 30000)
const root = createSuite('root', null)
let current = root

function createSuite(name, parent) {
  return {
    type: 'suite',
    name,
    parent,
    entries: [],
    before: [],
    after: [],
    beforeEach: [],
    afterEach: []
  }
}

function describe(name, fn) {
  const suite = createSuite(name, current)
  current.entries.push(suite)
  const parent = current
  current = suite
  try {
    fn()
  } finally {
    current = parent
  }
}

function it(name, options, fn) {
  if (typeof options === 'function') {
    fn = options
    options = undefined
  }
  current.entries.push({ type: 'test', name, fn, skip: options === false })
}

it.skip = (name, options, fn) => {
  if (typeof options === 'function') fn = options
  current.entries.push({ type: 'test', name, fn, skip: true })
}

function addHook(type, fn) {
  current[type].push(fn)
}

function invoke(fn, label) {
  const operation = fn.length === 0
    ? Promise.resolve().then(() => fn())
    : new Promise((resolve, reject) => {
        let complete = false
        const done = (error) => {
          if (complete) {
            reject(new Error(`${label} callback called more than once`))
            return
          }
          complete = true
          if (error) reject(error)
          else resolve()
        }
        try {
          fn(done)
        } catch (error) {
          reject(error)
        }
      })

  return Promise.race([
    operation,
    new Promise((_, reject) => {
      const timer = setTimeout(
        () => reject(new Error(`${label} exceeded ${timeoutMillis}ms`)),
        timeoutMillis
      )
      if (typeof timer.unref === 'function') timer.unref()
    })
  ])
}

async function runSuite(suite, inheritedBeforeEach, inheritedAfterEach, state, depth) {
  const indent = '  '.repeat(depth)
  console.log(`${indent}${suite.name}`)

  try {
    for (const fn of suite.before) await invoke(fn, `${suite.name} before hook`)
  } catch (error) {
    state.failed += 1
    console.error(`${indent}  FAIL before hook: ${error.stack || error}`)
    return
  }

  const beforeEach = [...inheritedBeforeEach, ...suite.beforeEach]
  const afterEach = [...suite.afterEach, ...inheritedAfterEach]

  for (const entry of suite.entries) {
    if (entry.type === 'suite') {
      await runSuite(entry, beforeEach, afterEach, state, depth + 1)
      continue
    }

    if (entry.skip) {
      state.skipped += 1
      console.log(`${indent}  SKIP ${entry.name}`)
      continue
    }

    let failure
    try {
      for (const fn of beforeEach) await invoke(fn, `${entry.name} beforeEach hook`)
      await invoke(entry.fn, entry.name)
    } catch (error) {
      failure = error
    } finally {
      try {
        for (const fn of afterEach) await invoke(fn, `${entry.name} afterEach hook`)
      } catch (error) {
        failure = failure || error
      }
    }

    if (failure) {
      state.failed += 1
      console.error(`${indent}  FAIL ${entry.name}: ${failure.stack || failure}`)
    } else {
      state.passed += 1
      console.log(`${indent}  PASS ${entry.name}`)
    }
  }

  for (const fn of suite.after) {
    try {
      await invoke(fn, `${suite.name} after hook`)
    } catch (error) {
      state.failed += 1
      console.error(`${indent}  FAIL after hook: ${error.stack || error}`)
    }
  }
}

async function run() {
  const state = { passed: 0, failed: 0, skipped: 0 }
  for (const suite of root.entries) {
    await runSuite(suite, [], [], state, 0)
  }
  console.log(`\n${state.passed} passed, ${state.skipped} skipped, ${state.failed} failed`)
  if (state.failed) process.exitCode = 1
  return state
}

const api = {
  describe,
  it,
  before: (fn) => addHook('before', fn),
  after: (fn) => addHook('after', fn),
  beforeEach: (fn) => addHook('beforeEach', fn),
  afterEach: (fn) => addHook('afterEach', fn),
  run
}

Object.assign(globalThis, api)

module.exports = api
