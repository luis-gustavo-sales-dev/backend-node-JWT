const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Token = require('../auth/token')

const userSchema = Schema({
  name: { type: String, minlength: 8, maxlength: 50, required: true },
  email: { type: String, minlength: 5, maxlength: 256, required: true },
  password: { type: String, min: 6, max: 50, required: true },
  role: { type: String, required: true, uppercase: true, 
    enum: [
      'USUARIO', 'ADMINISTRADOR'
  ]},
  tokens: [{ type: Schema.Types.ObjectId, ref: 'Token'}]
})

module.exports = mongoose.model('User', userSchema)