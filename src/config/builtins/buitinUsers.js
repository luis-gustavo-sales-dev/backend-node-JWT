const bcrypt = require('bcrypt')
const User = require('../../api/user/user')

const createAdmin = () => {
  let email = "admin@gmail.com"
  let password = 'admin'

  User.findOne({ email }, (err, user) => {

    if (err) {
      console.log("Erro no banco - Para procurar")
    } else if (user) {
      console.log("Já existe um admin no banco")
    } else {
      const salt = bcrypt.genSaltSync()
      const passwordHash = bcrypt.hashSync(password, salt)
      const userAdmin = new User({
        name: 'admin',
        email: email,
        password: passwordHash,
        role: 'SUPER',
        active: true
      })
    
      userAdmin.save( (err) => {
        if (err) {
          console.log("Erro no banco para salvar")
          console.log(err)
        } else {
          console.log("Administrador foi criado com sucesso!!!")
        }
      })
    }

  })

}

module.exports = {
  createAdmin
}