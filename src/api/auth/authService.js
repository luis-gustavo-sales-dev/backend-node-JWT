const _ = require('lodash')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../user/user')
const TokenBlackList = require('./tokenBlackList')
const env = require('../../.env')
const { tokenExpirationTime, regexs } = require('../../shared/consts')
const { sendErrorsFromDB } = require('../../shared/utils')


const login = async (req, res, next) => {
  const email = req.body.email || ''
  const password = req.body.password || ''
  const deviceId = req.body.deviceId || req.query.deviceId || req.headers['deviceId'] || ''

  if (!deviceId || deviceId == '') {
    return res.status(403).send( { 
      errors: ['Preciso do id do dispositivo para gerar o token']
    })
  }

  User.findOne( { email }, async (err, user) => {
    if (err) {
      return sendErrorsFromDB(res, err)
    } else if (user && bcrypt.compareSync(password, user.password)) {

      if (!user.active) return res.status(403).send( { errors: ['Seu usuário está inativo'] })

      // user.deviceId = deviceId
      let userObject = user.toJSON()
      userObject.deviceId = deviceId
      delete userObject.password
      const token = jwt.sign(userObject, env.authSecret, {
        expiresIn: tokenExpirationTime
      })

      // Não precisa disso pois já vem dentro do token
      // const { name, email } = user
      // O cliente deve decodificar o token
      res.json({token})

    } else {
      return res.status(400).send( { errors: ['Usuario ou senha inválido!! '] })
    }
  })
}

const tokenToBlackList = (req, res, next) => {
  let blockedToken = req.body.blockedtoken || ''

  // Adiciona o token na lista negra de tokens
  // console.log("BlockedToken: " + blockedToken)
  if (blockedToken) {
    let token = new TokenBlackList({
      token: blockedToken
    })
    token.save( (err) => {
      res.status(204).send({ 'messages': ['Token bloqueado!!']})
    })
  }
}

// Serve somente para retornar true ou false para mostrar se o token é válido ou não
const validateToken = (req, res, next) => {
  const token = req.body.token || ''

  jwt.verify(token, env.authSecret, function (err, decoded) {
      return res.status(200).send({ valid: !err })
  })

}



const signup = (req, res, next) => {
  const name = req.body.name || ''
  const email = req.body.email || ''
  const password = req.body.password || ''
  const confirmPassword = req.body.confirm_password || ''

  // Valida se o email é válido
  if (!email.match(regexs.emailRegex)) {
    return res.status(400).send( { errors: ['Email inválido']})
  }
  // Verifica se a senha bate com os critérios de segurança
  if (!password.match(regexs.passwordRegex)) {
    return res.status(400).send({
      errors: ['Senha é muito fraca!']
    })
  }

  // Compara se a senha e a confirmação se senha são as mesmas
  const salt = bcrypt.genSaltSync()
  const passwordHash = bcrypt.hashSync(password, salt)
  if (!bcrypt.compareSync(confirmPassword, passwordHash)) {
    return res.status(400).send({ errors: ['Senhas não conferem']})
  }
  // Procurar saber se já existe um usuário com o email
  // Caso não tenha ele cadastra um novo usuário com o email
  User.findOne( { email }, (err, user) => {

    if (err) {
      // Aqui deu erro no banco
      return sendErrorsFromDB(res, err)
    } else if (user) {
      // Aqui já existe um email
      return res.status(400).send({errors: ['Usuário já cadastrado']})
    } else {
      // Aqui eu cadastro o usuário
      const newUser = new User( {name, email, password: passwordHash, role: 'USUARIO'})
      newUser.save( err => {
        if (err) {
          // Aqui deu erro na hora de salvar
          return sendErrorsFromDB(res, err)
        } else {
          // Se não deu erro ele vai logar o usuário logo
          // login(req, res, next)
          res.status(201).send( { messages: ['Cadastro realizado. Confirme seu email para ativar seu usuário.']})
        }
      })
    }
  })
}

module.exports = { login, signup, validateToken, tokenToBlackList }