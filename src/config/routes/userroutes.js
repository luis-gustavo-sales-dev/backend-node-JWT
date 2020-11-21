const express = require('express')
const auth = require('../../config/auth')

// Rotas de usuários
module.exports = (server) => {
  const userRoutes = express.Router()
  server.use('/user',userRoutes)

  // Rotas precisam passar pelo middlware de autenticacao
  userRoutes.use(auth)

  userRoutes.get('/', (req, res) => {
    res.send('Usuários ...')
  })
}