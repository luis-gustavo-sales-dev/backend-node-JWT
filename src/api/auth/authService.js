const _ = require('lodash')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../user/user')
const env = require('../../.env')
const { tokenExpirationTime, regexs } = require('../../shared/consts')
const { sendErrorsFromDB, validateToken } = require('../../shared/utils')


const login = (req, res, next) => {
  const email = req.body.email || ''
  const password = req.body.password || ''
  const deviceId = req.body.deviceId || req.query.deviceId || req.headers['deviceId'] || ''

  if (!deviceId || deviceId == '') {
    return res.status(403).send( { 
      errors: ['Preciso do id do dispositivo para gerar o token']
    })
  }

  User.findOne( { email }, (err, user) => {
    if (err) {
      return sendErrorsFromDB(res, err)
    } else if (user && bcrypt.compareSync(password, user.password)) {

      // Procura se há algum token para o dispositivo
      const deviceTokenFounded = user.tokens.find( (token) => {
        return validateToken(token, deviceId)
      })

      // Ainda não há token para o dispositivo enviado
      if (!deviceTokenFounded) {
        
        const token = jwt.sign(user.toJSON(), env.authSecret, {
          expiresIn: tokenExpirationTime
        })

        user.tokens.push({
          token: token,
          deviceId: deviceId
        })

        user.save()
        const { name, email } = user
        res.json( {name, email, token, deviceId })

      } else {
        // Existe token já criado para o dispositivo
        const { name, email } = user
        res.json( {name, email, "token": deviceTokenFounded.token, "deviceId": deviceTokenFounded.deviceId })
      }

      // console.log(user)
    } else {
      return res.status(400).send( { errors: ['Usuario ou senha inválido!! '] })
    }
  })
}

/*const validateToken = (req, res, next) => {
  // Se o token for valido ele vai retorna valid: true caso contrário será false (pois vai conter um erro (err) ele será true)
  let data = jwt.verify(token, env.authSecret, (err, decoded) => {
    // console.log(!err, decoded)
    return { "valid": !err, decoded }
  })

  return data;
}*/

// TODO: PROBLEMA: O token tem que ser armazenado fora do documento do usuário pois dará muito trabalho pegar o token que está dentro do objeto user.
const findUserByToken = (req, res, next) => {
  const token = req.body.token || ''
  const deviceId = req.body.deviceId || req.query.deviceId || req.headers['deviceId'] || ''
  // let dataValidation = validateToken(req, res)
  // console.log(dataValidation)

  User.findOne( {_id: dataValidation.decoded._id }, (err, user) => {
    if (err) {
      sendErrorsFromDB(res, err)
    } else if (user) {
      user.password = ''
      return res.status(200).send(user)
    } else {
      return res.status(404).send( {errors: ['Usuário não encontrado!!'] })
    }
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
          login(req, res, next)
        }
      })
    }
  })
}

module.exports = { login, signup, findUserByToken }