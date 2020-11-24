const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = Schema({
  name: { type: String, minlength: 5, maxlength: 50, required: true },
  email: { type: String, minlength: 5, maxlength: 256, required: true },
  password: { type: String, min: 6, max: 50, required: true },
  active: { type: Boolean, required: true, default: false},
  role: { type: String, required: true, uppercase: true, 
    enum: [
      'USUARIO', 'ADMINISTRADOR', 'SUPER'
  ]}
})

module.exports = mongoose.model('User', userSchema)