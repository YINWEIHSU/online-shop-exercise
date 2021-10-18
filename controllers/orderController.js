if (process.env.NODE_ENV !== 'production') require('dotenv').config()
const db = require('../models')
const { Order, Product, OrderItem, Cart, User } = db
const getTradeInfo = require('../config/getTradeInfo')
const create_mpg_aes_decrypt = require('../config/create_mpg_aes_decrypt')


let orderController = {
  getOrder: async (req, res) => {
    console.log('session:', req.session)
    let order = await Order.findOne({
      where: {
        id: req.session.OrderId,
      },
      include: ['items']
    })
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
  getPayment: async (req, res) => {
    console.log('===== getPayment =====')
    console.log(req.params.id)
    console.log('==========')
    let order = await Order.findByPk(req.params.id, {})
    let sn = order.sn || Date.now()
    const tradeInfo = getTradeInfo(order.amount, '產品名稱', 'test@example.com', sn)
    order.update({
      ...req.body,
      sn: tradeInfo.MerchantOrderNo,
    })
    return res.render('payment', {
      order: order.toJSON(),
      tradeInfo
    })
  },
  newebpayCallback: (req, res) => {
    const data = JSON.parse(create_mpg_aes_decrypt(req.body.TradeInfo))

    console.log('===== spgatewayCallback: create_mpg_aes_decrypt、data =====')
    console.log(data)

    return Order.findAll({ where: { sn: data['Result']['MerchantOrderNo'] } }).then(orders => {
      orders[0].update({
        ...req.body,
        payment_status: 1,
      }).then(order => {
        console.log("return order", order)
        req.session.OrderId = order.id
        return res.redirect('/order')
      })
    })

  }
}

module.exports = orderController