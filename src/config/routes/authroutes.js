const express = require('express')
// const auth = require('./auth')

module.exports = (server) => {
  
  const authRoutes = express.Router()
  server.use('/auth', authRoutes)

  const AuthService = require('../../api/auth/authService')
  authRoutes.post('/login', AuthService.login)
  authRoutes.post('/signup', AuthService.signup)
  // openApi.post('/validatetoken', AuthService.validateToken)
  authRoutes.post('/validatetoken', AuthService.findUserByToken)
}