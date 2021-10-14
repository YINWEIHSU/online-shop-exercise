const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

module.exports = app => {
  app.use(passport.initialize())
  app.use(passport.session())

  passport.use(new LocalStrategy({ usernameField: 'email', passReqToCallback: true, }, (req, email, password, done) => {
    User.findOne({ where: { email } })
      .then(user => {
        if (!user) {
          return done(null, false, req.flash('error_message', '該帳號不存在'))
        }
        return bcrypt.compare(password, user.password).then(isMatch => {
          if (!isMatch) {
            console.log('帳號密碼錯誤')
            return done(null, false, req.flash('error_message', '帳號密碼錯誤'))
          }
          console.log('登入成功')
          return done(null, user)
        })
      })
      .catch(err => {
        console.log(err)
        done(err, false)
      })
  }))

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findByPk(id).then(user => {
      user = user.toJSON()
      done(null, user)
    }).catch(err => console.log(err))
  })
}