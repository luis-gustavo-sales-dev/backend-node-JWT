const express = require('express')
const auth = require('../security/auth')
const { adminUserPermission } = require('../security/role')


module.exports = (server) => {
  
  const authRoutes = express.Router()
  server.use('/auth', authRoutes)

  const AuthService = require('../../api/auth/authService')
  authRoutes.post('/login', AuthService.login)
  authRoutes.post('/signup', AuthService.signup)
  // openApi.post('/validatetoken', AuthService.validateToken)
  authRoutes.post('/validatetoken', AuthService.validateToken)

  // TODO: ESSE DAQUI PRECISA PASSAR PELO MIDDLEWARE AUTH e
  // OUTRO DE PERMISSAO DE "SUPER" OU "ADMIN"
  authRoutes.post('/blocktoken', auth, adminUserPermission, AuthService.tokenToBlackList)
}