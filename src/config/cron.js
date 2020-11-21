const cron = require('node-cron')
const Token = require('../api/auth/token')

const removeInvalidTokensPer = (intervalToRemove) => {
  cron.schedule("* * * * *", () => {
    console.log("ativando limpeza de tokens!!!")
    // Vai apagar todos que está desativados é com a data de expiração vencida
    Token.deleteMany({ $or: [ {active: false}, { dataexpiracao: { $lt: new Date()} } ] })
      .then( () => {
        console.log("Apaguei")
      })
      .catch ((err) => {
        console.log(err)
      })
  })
}

const removeAlreadyDeletedTokenFromTokensInUsers = (intervalToRemove) => {
  cron.schedule('* * * * *', () => {
    
  })
}

module.exports = { removeInvalidTokensPer }