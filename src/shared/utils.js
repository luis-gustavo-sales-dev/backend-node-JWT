const jwt = require('jsonwebtoken')
const env = require('../.env')
const TokenBlackList = require('../api/auth/tokenBlackList')
const _ = require('lodash')


// Exportadas
const sendErrorsFromDB = (res, dbErrors) => {
  const errors = []
  _.forIn(dbErrors.errors, error => errors.push(error.message))
  return res.status(400).json({ errors })
}

const verifyToken = (token, res, next) => {
      // Se o token for válido, ele vai retornar esse decoded
    // Se não for válido ele vai ter conteúdo em err
    // VERIFICA O TOKEN E O DEVICE ID QUE ESTARÃO NO BANCO
    jwt.verify(token, env.authSecret, (err, decoded) => {
      if (err) {
        return res.status(403).send({ errors: ['O token é inválido!!!']})
      } else {

        // O token está na blacklist?
        TokenBlackList.findOne( {token: token}, (err, t) => {
          if(t) {
            res.status(404).send({ 'messages': 'Você está tentando usar um token bloqueado!!'})
          } else {
            next()
          }
        })
      }
    })
}

// Remove campos dos usuário
const removerFieldFromUser = (user, fieldsToRemove) => {
  let userFields = Object.keys(user)
  _.forIn(userFields, (field) => {
    if (fieldsToRemove.includes(field)) {
      delete user[`${field}`]
    }
  })
  return user
}

module.exports = { sendErrorsFromDB, verifyToken, removerFieldFromUser }