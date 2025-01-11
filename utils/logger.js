import proccessVars from "./confige.js"

const info = (...messages) => {
  if(proccessVars.NODE_ENV === 'test') return
  console.log(...messages)
}

const error = (...messages) => {
  if(proccessVars.NODE_ENV === 'test') return
  console.log(...messages)
}

const logger = {
  info,
  error,
}
export default logger
