const express = require('express')
const auth = require('../security/auth')

const UserService = require('../../api/user/userService')

// Rotas de usuários
module.exports = (server) => {
  const userRoutes = express.Router()
  server.use('/user',userRoutes)

  // Rotas precisam passar pelo middlware de autenticacao
  userRoutes.use(auth)

  userRoutes.get('/', UserService.getLoggedUserInfoByToken)
}