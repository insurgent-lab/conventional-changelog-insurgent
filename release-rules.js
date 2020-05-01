const rules = require('./rules')

module.exports = [
  ...rules.minor.map(type => ({ type, release: 'minor' })),
  ...rules.patch.map(type => ({ type, release: 'patch' })),
]