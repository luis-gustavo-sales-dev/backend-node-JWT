const User = require('../../api/user/user')
const jwt = require('jsonwebtoken')

const adminUserPermission = (req, res, next) => {
  let token = req.body.token || ''
  // O token já foi verificado pelo middlware auth
  let decoded = jwt.decode(token)
  // console.log(decoded)

  User.findOne({ _id: decoded._id }, (err, user) => {
    if (user.role === 'ADMINISTRADOR' || user.role === 'SUPER') {
      next()
    } else {
      res.status(403).json({ errors: ['Você precisa ser administrador ou super para fazer isso']})
    }
  })
  
}

const superUserPermission = (req, res, next) => {
  let token = req.body.token || ''
  // O token já foi verificado pelo middlware auth
  let decoded = jwt.decode(token)
  // console.log(decoded)

  User.findOne({ _id: decoded._id }, (err, user) => {
    if (user.role === 'SUPER') {
      next()
    } else {
      res.status(403).json({ errors: ['Você precisa ser super para fazer isso']})
    }
  })
  
}



module.exports = {
  adminUserPermission,
  superUserPermission
}