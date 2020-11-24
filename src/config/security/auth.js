// Esse cara aqui é um filtro para autenticacao
// Ele vai verificar se a requisição possui acesso (tipo se tem token)

const jwt = require('jsonwebtoken')
const env = require('../../.env')
const { verifyToken } = require('../../shared/utils')

module.exports = (req, res, next) => {
  // O méthod option é usado para saber se o CORS está habilitado
  // Essa consulta não deve ser verificado por esse filtro de autenticação
  if (req.method === 'OPTIONS') {
    next()
  } else {
    // Tenta pegar o token pelo corpo, query (URL) ou no cabeçalho
    // Lembrando que os headers devem ser adicicionados no cors para que ele aceite
    const token = req.body.token || req.query.token || req.headers['authorization']

    if (!token)   return res.status(403).send( {errors: ['Você precisa de um token válido para acessar essa área']})

    verifyToken(token, res, next)
    
  }
}
