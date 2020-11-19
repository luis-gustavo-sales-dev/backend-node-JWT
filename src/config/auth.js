// Esse cara aqui é um filtro para autenticacao
// Ele vai verificar se a requisição possui acesso (tipo se tem token)

const jwt = require('jsonwebtoken')
const env = require('../.env')

module.exports = (req, res, next) => {
  // O méthod option é usado para saber se o CORS está habilitado
  // Essa consulta não deve ser verificado por esse filtro de autenticação
  if (req.method === 'OPTIONS') {
    next()
  } else {
    // Tenta pegar o token pelo corpo, query (URL) ou no cabeçalho
    // Lembrando que os headers devem ser adicicionados no cors para que ele aceite
    const token = req.body.token || req.query.token || req.headers['authorization']
    const deviceId = req.body.deviceId || req.query.deviceId || req.headers['deviceId']

    if(!token || !deviceId) {
      return res.status(403).send( {errors: ['Preciso do token e do deviceid!']})
    }

    // Se o token for válido, ele vai retornar esse decoded
    // Se não for válido ele vai ter conteúdo em err
    // VERIFICA O TOKEN E O DEVICE ID QUE ESTARÃO NO BANCO
    jwt.verify(token, env.authSecret, (err, decoded) => {
      if (err) {
        return res.status(403).send({ errors: ['O token é inválido!!!']})
      } else {
        // O token é válido; ele adiciona o token decodificado na requisição (opcional) e passar para o próximo middleware
        // req.decoded = decoded
        next()
      }
    })
  }
}
