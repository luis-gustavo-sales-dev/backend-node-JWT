module.exports = (req, res, next) => {
  // Aqui são os IPs ou domínios que esse servidor aceita requisições
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
  // Aqui são colocados os campos aceitos no cabeçalho
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  next()
}