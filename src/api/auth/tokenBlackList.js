const mongoose = require('mongoose')
const Schema = mongoose.Schema

const tokenSchema = Schema({
  token: { type: String, required: true }
})

module.exports = mongoose.model('TokenBlackList', tokenSchema)