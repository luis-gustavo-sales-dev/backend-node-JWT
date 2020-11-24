const cron = require('node-cron')
const TokenBlackList = require('../api/auth/tokenBlackList')

const removeInvalidTokensPer = (intervalToRemove) => {
  /*cron.schedule("* * * * *", () => {
    console.log("ativando limpeza de tokens!!!")
    // Vai apagar todos que está desativados é com a data de expiração vencida
    // O objeto está encodado. Preciso pegar e desencodar primeiro ou já gravar os dados
    // desencodados
    TokenBlackList.deleteMany( { dataexpiracao: { $lt: new Date()} } )
      .then( () => {
        console.log("Apaguei")
      })
      .catch ((err) => {
        console.log(err)
      })
  })*/
}

module.exports = { removeInvalidTokensPer }