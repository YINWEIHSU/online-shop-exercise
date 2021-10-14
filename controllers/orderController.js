const db = require('../models')
const user = require('../models/user')
const { Order, Product, OrderItem, Cart } = db

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
  getOrder: async (req, res) => {
    let order = await Order.findOne({
      where: {
        id: req.session.OrderId,
        shipping_status: 0
      },
      include: ['items']
    })
    console.log(order)
    await res.render('order', {
      order: order.toJSON()
    })

  },
  postOrder: (req, res) => {
    return Cart.findByPk(req.body.cartId, { include: 'items' }).then(cart => {
      let id = 0
      if (req.user) id = req.user.id
      return Order.create({
        name: req.body.name,
        address: req.body.address,
        phone: req.body.phone,
        email: req.body.email,
        shipping_status: req.body.shipping_status,
        payment_status: req.body.payment_status,
        amount: req.body.amount,
        UserId: id
      }).then(order => {
        const results = [];
        req.session.OrderId = order.id
        console.log(req.session)
        for (let i = 0; i < cart.items.length; i++) {
          console.log(order.id, cart.items[i].id)
          results.push(
            OrderItem.create({
              OrderId: order.id,
              ProductId: cart.items[i].id,
              price: cart.items[i].price,
              quantity: cart.items[i].CartItem.quantity,
            })
          );
        }
        return Promise.all(results).then(() =>
          res.redirect(`/order`)
        );

      })
    })
  },
  cancelOrder: (req, res) => {
    return Order.findByPk(req.params.id, {}).then(order => {
      order.update({
        ...req.body,
        shipping_status: '-1',
        payment_status: '-1',
      }).then(order => {
        return res.redirect('/products')
      })
    })
  },
}

module.exports = orderController