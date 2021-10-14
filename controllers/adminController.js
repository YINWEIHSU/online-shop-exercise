const bcrypt = require('bcryptjs')
const db = require('../models')
const { User, Order, Product, Cart } = db
const fs = require('fs')

let userController = {
  signInPage: async (req, res) => {
    res.render('adminSignin', { layout: '' })
  },
  signIn: (req, res) => {
    console.log(req.user)
    if (req.user.role !== 'admin') {
      req.flash('error_message', '權限不足')
      req.logout()
      return res.redirect('/admin/login')
    }
    req.flash('success_message', '成功登入')
    return res.redirect('/admin/orders')
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
  createProduct: (req, res) => {
    return res.render('adminProduct', {
      layout: 'admin'
    })
  },
  getProduct: (req, res) => {
    Product.findByPk(req.params.id).then(product => {
      console.log(product)
      return res.render('adminProduct', {
        product: product.toJSON(),
        layout: 'admin'
      })
    })
  },
  postProduct: (req, res) => {
    if (!req.body.name) {
      req.flash('error_message', "名稱不得為空")
      return res.redirect('back')
    }
    const { file } = req
    if (file) {
      fs.readFile(file.path, (err, data) => {
        if (err) console.log('Error: ', err)
        fs.writeFile(`upload/${file.originalname}`, data, () => {
          return Product.create({
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            image: file ? `/upload/${file.originalname}` : null
          }).then(product => {
            req.flash('success_message', '成功上架商品')
            return res.redirect('/admin/products')
          })
        })
      })
    } else {
      return Product.create({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        image: null
      }).then((product) => {
        req.flash('success_message', '成功上架商品')
        return res.redirect('/admin/products')
      })
    }
  },
  putProduct: (req, res) => {
    if (!req.body.name) {
      req.flash('error_message', "名稱不得為空")
      return res.redirect('back')
    }
    const { file } = req
    if (file) {
      fs.readFile(file.path, (err, data) => {
        if (err) console.log('Error: ', err)
        fs.writeFile(`upload/${file.originalname}`, data, () => {
          console.log('data', data)
          return Product.findByPk(req.params.id)
            .then(product => {
              console.log('product:', product)
              product.update({
                name: req.body.name,
                price: req.body.price,
                description: req.body.description,
                image: file ? `/upload/${file.originalname}` : product.image
              }).then(product => {
                req.flash('success_message', '成功更新商品資訊')
                return res.redirect('/admin/products')
              })
            })
        })
      })
    } else {
      return Product.findByPk(req.params.id)
        .then(product => {
          product.update({
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            image: product.image
          }).then(product => {
            req.flash('success_message', '成功更新商品資訊')
            res.redirect('/admin/products')
          })
        })
    }
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