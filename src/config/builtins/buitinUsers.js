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

const createUsers = (numberofusers) => {
  let initialEmail = 'luisgssf'
  let finalEmail = "@gmail.com"
  let password = 'luisgssf'

  for (let y=1; y<=numberofusers; y++) {
    let email = `${initialEmail}${y}${finalEmail}`
    User.findOne({ email }, (err, user) => {
  
      if (err) {
        console.log("Erro no banco - Para procurar")
      } else if (user) {
        console.log(`Já existe o usuário ${email} no banco!!`)
      } else {
        const salt = bcrypt.genSaltSync()
        const passwordHash = bcrypt.hashSync(password, salt)
        const normalUser = new User({
          name: initialEmail + y,
          email: email,
          password: passwordHash,
          role: 'USUARIO',
          active: y == 1
        })
      
        normalUser.save( (err) => {
          if (err) {
            console.log("Erro no banco para salvar")
            console.log(err)
          } else {
            console.log("Usuário foi criado foi criado com sucesso!!!")
          }
        })
      }
  
    })

  }


}

module.exports = {
  createAdmin,
  createUsers
}