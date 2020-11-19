const _ = require('lodash')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../user/user')
const Token = require('../auth/token')
const env = require('../../.env')
const { tokenExpirationTime, regexs } = require('../../shared/consts')
const { sendErrorsFromDB, validateToken } = require('../../shared/utils')


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

      // Procura se há algum token para o dispositivo
      if(user.tokens) {
        // let userTokens = await Token.find().where('_id').in(user.tokens).exec()
        let userTokens = await Token.find({
          '_id': { $in: user.tokens },
          'active': true
        })
        
        const deviceTokenFounded = userTokens.find( (token) => {
          return validateToken(token, deviceId)
        })

        if (!deviceTokenFounded) {
    
          const newStringToken = jwt.sign(user.toJSON(), env.authSecret, {
            expiresIn: tokenExpirationTime
          })
  
          const newToken = new Token( {
            token: newStringToken,
            deviceId,
            user: user._id
          })
          // Talvez não precise disso se você gerar antes no schema da seguinte forma:
          // _id: new mongoose.Types.ObjectId(),
          newToken.save()
  
          user.tokens.push(newToken)
  
          user.save()
          const { name, email } = user
          res.json( {name, email, "token": newToken, deviceId })
  
        } else {
          // Existe token já criado para o dispositivo
          const { name, email } = user
          res.json( {name, email, "token": deviceTokenFounded })
        }

      }
      
    } else {
      return res.status(400).send( { errors: ['Usuario ou senha inválido!! '] })
    }
  })
}

const findUserByToken = (req, res, next) => {
  const token = req.body.token || ''
  const deviceId = req.body.deviceId || req.query.deviceId || req.headers['deviceId'] || ''

  Token.findOne( { token }, (err, token) => {
    // console.log(token.user)
    if (token && token.deviceId === deviceId && token.active) {
      User.findOne( {_id: token.user}, (err, user) => {
        const { name, email, role} = user
        res.json( { name, email, token, role} )
      })
    } else {
      res.json( { errors: ['Seu token é invalido!']})
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