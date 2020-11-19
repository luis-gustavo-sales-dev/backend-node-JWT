const restful = require('node-restful')
const mongoose = restful.mongoose
const { tokenExpirationTimeInDays } = require('../../shared/consts')

const tokenSchema = new mongoose.Schema({
  token: { type: String, required: true },
  datacriacao: { type: Date, default: new Date() },
  dataexpiracao: { type: Date, default: () => {
      var result = new Date();
      result.setDate(result.getDate() + tokenExpirationTimeInDays);
      return result;
    }
  },
  active: { type: Boolean, default: true, required: true },
  deviceId: { type: String, required: true }
})

module.exports =  restful.model('Token', tokenSchema)