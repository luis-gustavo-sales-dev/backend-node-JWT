// Privadas
const isTokenExpired = (token) => {
  const dataatual = new Date()
  return dataatual > token.dataexpiracao
}

// Exportadas
const sendErrorsFromDB = (res, dbErrors) => {
  const errors = []
  _.forIn(dbErrors.errors, error => errors.push(error.message))
  return res.status(400).json({ errors })
}

const validateTokenFromDevice = (token, deviceId) => {
  if (token && deviceId) {
    return token.deviceId === deviceId
  } else {
    return false;
  }
}

module.exports = { sendErrorsFromDB, validateTokenFromDevice }