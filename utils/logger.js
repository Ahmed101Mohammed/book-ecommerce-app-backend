const info = (...messages) => {
  console.log(...messages)
}

const error = (...messages) => {
  console.log(...messages)
}

const logger = {
  info,
  error,
}
module.exports = logger
