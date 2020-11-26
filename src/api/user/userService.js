const User = require('./user')
const { sendErrorsFromDB, removerFieldFromUser } = require('../../shared/utils')
const jwt = require('jsonwebtoken')

const deleteUsuario = (req, res, next) => {
  // Precisa trabalhar com função de usuário aqui
  // Só que pode apagar é o próprio usuário ou um admin
}

// Tem que chamar o midleware auth antes para verificar se o token é valido
const getLoggedUserInfoByToken = (req, res, next) => {
  const token = req.headers.authorization || ''
  if (token) {
    let decoded = jwt.decode(token)
    User.findOne( { _id: decoded._id }, (err, user) => {
      if (err) {
        return sendErrorsFromDB(res, err)
      } else if (user) {
        user = user.toJSON()
        // Não precisa enviar senha nem o campo __v
        user = removerFieldFromUser(user, ['password', '__v'])
        return res.status(200).json(user)
      } else {
        return res.status(404).send( { error: 'Usuário não encontrado!!' })
      }
    })
  }
}

module.exports = { getLoggedUserInfoByToken, deleteUsuario }