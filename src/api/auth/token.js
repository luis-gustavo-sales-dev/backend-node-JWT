const { tokenExpirationTimeInDays } = require('../../shared/consts')
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const User = require('../user/user')

const tokenSchema = Schema({
  token: { type: String, required: true },
  datacriacao: { type: Date, default: new Date() },
  dataexpiracao: { type: Date, default: () => {
      var result = new Date();
      result.setDate(result.getDate() + tokenExpirationTimeInDays);
      return result;
    }
  },
  active: { type: Boolean, default: true, required: true },
  deviceId: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User' }
})

module.exports = mongoose.model('Token', tokenSchema)