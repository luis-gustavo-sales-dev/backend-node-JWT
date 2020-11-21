const port = 3003

const bodyParser = require('body-parser')
const express = require('express')
const server = express()
const allowCors = require('./cors')
// Converte parâmetros do query da requisição para valor numérico (talvez desnecessário)
const queryParser = require('express-query-int')
// Ativação do cron
const enableCron = require('./cron')

server.use(bodyParser.urlencoded({ extended: true }))
server.use(bodyParser.json())
server.use(allowCors)
server.use(queryParser())

// Ativação do cron
enableCron.removeInvalidTokensPer(1)

server.listen(port, function() {
    console.log(`Servidor de autenticacao está rodando: ${port}.`)
})

module.exports = server
