'use strict'
var conventionalRecommendedBump = require('conventional-recommended-bump')
var preset = require('../')
var expect = require('chai').expect
var mocha = require('mocha')
var describe = mocha.describe
var it = mocha.it
var gitDummyCommit = require('git-dummy-commit')
var shell = require('shelljs')
var betterThanBefore = require('better-than-before')()
var preparing = betterThanBefore.preparing

betterThanBefore.setups([
  function () { // 1
    shell.config.resetForTesting()
    shell.cd(__dirname)
    shell.rm('-rf', 'tmp')
    shell.mkdir('tmp')
    shell.cd('tmp')
    shell.mkdir('git-templates')
    shell.exec('git init --template=./git-templates')
  },
  function () { // 2
    shell.exec('git tag v0.0.0')
    gitDummyCommit(['feat(awesome): my awesome feat'])
  },
  function () { // 3
    shell.exec('git tag v0.1.0')
    gitDummyCommit(['improvement(awesome): my awesome improvement'])
  },
  function () { // 4
    shell.exec('git tag v0.2.0')
    gitDummyCommit(['fix: fixed bug with dates'])
  },
  function () { // 5
    shell.exec('git tag v0.2.1')
    gitDummyCommit(['perf: improved performance of data fetching'])
  },
  function () { // 6
    shell.exec('git tag v0.2.2')
    gitDummyCommit(['task: updated some bs config file'])
  },
  function () { // 7
    shell.exec('git tag v0.2.3')
    gitDummyCommit(['build(deps): bump dependencies'])
  },
  function () { // 8
    shell.exec('git tag v0.2.4')
    gitDummyCommit(['refactor: refactor code'])
    gitDummyCommit(['docs: update docs'])
    gitDummyCommit(['ci: update ci config'])
    gitDummyCommit(['test: added new tests'])
    gitDummyCommit(['style: fix ESLint warnings'])
    gitDummyCommit(['chore: some chore commit'])
  },
  function () { // 9
    gitDummyCommit(['feat(awesome): my awesome feat'])
    gitDummyCommit(['fix: fixed bug with dates'])
  },
  function() { // 10
    shell.exec('git tag v0.3.0')
    gitDummyCommit(['refactor: updated module x', 'BREAKING CHANGE: changed parameters of the modules.'])
  },
])

describe('version recommender', function () {
  it('should identify feat as minor', function (done) {
    preparing(2)

    conventionalRecommendedBump({
      config: preset
    }, {}, (_, recommendation) => {
      expect(recommendation.releaseType).to.equal('minor')
      done()
    })
  })

  it('should identify improvement as minor', function (done) {
    preparing(3)

    conventionalRecommendedBump({
      config: preset
    }, {}, (_, recommendation) => {
      expect(recommendation.releaseType).to.equal('minor')
      done()
    })
  })

  it('should identify fix as patch', function (done) {
    preparing(4)

    conventionalRecommendedBump({
      config: preset
    }, {}, (_, recommendation) => {
      expect(recommendation.releaseType).to.equal('patch')
      done()
    })
  })

  it('should identify perf as patch', function (done) {
    preparing(5)

    conventionalRecommendedBump({
      config: preset
    }, {}, (_, recommendation) => {
      expect(recommendation.releaseType).to.equal('patch')
      done()
    })
  })

  it('should identify task as patch', function (done) {
    preparing(6)

    conventionalRecommendedBump({
      config: preset
    }, {}, (_, recommendation) => {
      expect(recommendation.releaseType).to.equal('patch')
      done()
    })
  })

  it('should identify build as patch', function (done) {
    preparing(7)

    conventionalRecommendedBump({
      config: preset
    }, {}, (_, recommendation) => {
      expect(recommendation.releaseType).to.equal('patch')
      done()
    })
  })

  it('should ignore refactor / docs / ci / test / style / chore', function (done) {
    preparing(8)

    conventionalRecommendedBump({
      config: preset
    }, {}, (_, recommendation) => {
      expect(recommendation).to.eql({})
      done()
    })
  })

  it('should prioritize minor over patch', function (done) {
    preparing(9)

    conventionalRecommendedBump({
      config: preset
    }, {}, (_, recommendation) => {
      expect(recommendation.releaseType).to.equal('minor')
      done()
    })
  })

  it('should identify breaking changes as major', function (done) {
    preparing(10)

    conventionalRecommendedBump({
      config: preset
    }, {}, (_, recommendation) => {
      expect(recommendation.releaseType).to.equal('major')
      done()
    })
  })

})
