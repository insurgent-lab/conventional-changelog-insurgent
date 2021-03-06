'use strict'

const parserOpts = require(`./parser-opts`)

const rules = require('./rules')

module.exports = {
  parserOpts,

  whatBump: (commits) => {
    let level = 3
    let breakings = 0
    let features = 0

    commits.forEach(commit => {
      if (commit.notes.length > 0) {
        breakings += commit.notes.length
        level = 0
      } else if (rules.minor.includes(commit.type)) {
        features += 1
        if (level === 2 || level === 3) {
          level = 1
        }
      } else if (rules.patch.includes(commit.type)) {
        if (level === 3) {
          level = 2
        }
      }
    })

    if (level == 3) return undefined

    return {
      level: level,
      reason: breakings === 1
        ? `There is ${breakings} BREAKING CHANGE and ${features} features`
        : `There are ${breakings} BREAKING CHANGES and ${features} features`
    }
  }
}
