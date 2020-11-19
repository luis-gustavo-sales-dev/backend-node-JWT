module.exports = function (server) {
  // Rotas autenticacao
  const authroutes = require('./routes/authroutes')(server)

  // Outras rotas
  const userroutes = require('./routes/userroutes')(server)
}