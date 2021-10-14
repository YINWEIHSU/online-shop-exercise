const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db

let userController = {
  signInPage: async (req, res) => {
    res.render('login')
  },
  signUp: async (req, res) => {
    const { name, email, password, confirmPassword } = req.body
    // confirm password
    if (confirmPassword !== password) {
      console.log('密碼不符')
      return res.render('login', {
        name,
        email,
        password
      })
    }
    // confirm unique user
    const user = await User.findOne({ where: { email } })
    if (user) {
      req.flash('error_messages', '用戶已存在')
      return res.render('login', {
        name,
        email,
        password,
        confirmPassword
      })
    }
    const newUser = await User.create({
      role: 'user',
      name,
      email,
      password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
    })
    if (!newUser) {
      console.log('帳號創建失敗')
      req.flash('error_messages', '用戶創建失敗')
      return res.redirect('/login')
    }
    console.log('帳號創建成功')
    req.flash('success_messages', '帳號創建成功')
    return res.redirect('/products')
  },
  logout: (req, res) => {
    res.send('logout')
  }
}

module.exports = userController