const db = require('../models')
const Order = db.Order
const Product = db.Product

let orderController = {
  getOrders: async (req, res) => {
    let orders = await Order.findAll({
      include: ['items'],
    })
    orders = JSON.parse(JSON.stringify(orders))
    await res.render('orders', {
      orders: orders
    })
  },
}

module.exports = orderController