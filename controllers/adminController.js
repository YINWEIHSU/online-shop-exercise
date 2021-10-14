const bcrypt = require('bcryptjs')
const db = require('../models')
const { User, Order, Product, Cart } = db

let userController = {
  signInPage: async (req, res) => {
    res.render('adminSignin', { layout: '' })
  },
  signIn: (req, res) => {
    if (req.user.role !== 'admin') {
      req.flash('error_messages', '權限不足')
      req.logout()
      return res.redirect('/admin/signin')
    }
    req.flash('success_messages', 'Sign in successfully.')
    return res.redirect('/admin/users')
  },
  getOrders: async (req, res) => {
    let orders = await Order.findAll({
      include: ['items'],
    })
    orders = JSON.parse(JSON.stringify(orders))
    await res.render('orders', {
      orders: orders,
      layout: 'admin'
    })
  },
  getOrder: async (req, res) => {
    let order = await Order.findOne({
      where: {
        id: req.params.id,
      },
      include: ['items']
    })
    await res.render('orderInfo', {
      order: order.toJSON(),
      layout: 'admin'
    })
  },
  getProducts: (req, res) => {
    Product.findAll({
      raw: true,
      nest: true
    }).then(products => {
      products = JSON.parse(JSON.stringify(products))

      return res.render('adminProducts', {
        products,
        layout: 'admin'
      })
    })
  },
  getCustomers: async (req, res) => {
    User.findAll({
      where: { role: 'user' },
      include: [{ model: Order }],
      nest: true
    }).then(users => {
      users = JSON.parse(JSON.stringify(users))
      return res.render('customers', {
        users,
        layout: 'admin'
      })
    })
  },
  logout: (req, res) => {
    res.send('logout')
  }
}

module.exports = userController