const authenticator = (req, res, next, role) => {
  if (!req.isAuthenticated()) {
    req.flash('error_messages', `請先登入`)
    if (role === 'user') return res.redirect('/login')
    if (role === 'admin') return res.redirect('/admin/login')
  } else if (req.user.role !== role) {
    req.flash('error_messages', `權限不足`)
    req.logout()
    if (role === 'user') return res.redirect('/login')
    if (role === 'admin') return res.redirect('/admin/login')
  }
  next()
}

module.exports = {
  checkIfAdmin: (req, res, next) => {
    return authenticator(req, res, next, 'admin')
  },

  checkIfUser: (req, res, next) => {
    return authenticator(req, res, next, 'user')
  }
}