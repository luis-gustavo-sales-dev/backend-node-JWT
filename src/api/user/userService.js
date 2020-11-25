const User = require('./user')
const { sendErrorsFromDB } = require('../../shared/utils')
const jwt = require('jsonwebtoken')

const deleteUsuario = (req, res, next) => {
  // Precisa trabalhar com função de usuário aqui
  // Só que pode apagar é o próprio usuário ou um admin
}

// Tem que chamar o midleware auth antes
const getLoggedUserInfoByToken = (req, res, next) => {
  const token = req.headers.authorization || ''
  if (token) {
    let decoded = jwt.decode(token)
    User.findOne( { _id: decoded._id }, (err, user) => {
      if (err) {
        return sendErrorsFromDB(res, err)
      } else if (user) {
        res.json(user)
      } else {
        res.status(404).send( { error: 'Usuário não encontrado!!' })
      }
    })
  }
}

module.exports = { getLoggedUserInfoByToken, deleteUsuario }