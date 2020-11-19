const restful = require('node-restful')
const mongoose = restful.mongoose
const Token = require('../auth/token')

const userSchema = new mongoose.Schema({
  name: { type: String, minlength: 8, maxlength: 50, required: true },
  email: { type: String, minlength: 5, maxlength: 256, required: true },
  password: { type: String, min: 6, max: 50, required: true },
  role: { type: String, required: true, uppercase: true, 
    enum: [
      'USUARIO', 'ADMINISTRADOR'
  ]},
  tokens: [Token]
})

module.exports = restful.model('User', userSchema)