const path = require('node:path')

const apstractPath = (...pathElements) => {
  return path.join(__dirname, '..', ...pathElements)
}

module.exports = apstractPath
