const db = require('../models')
const { Product, Cart } = db
const PAGE_LIMIT = 10;
const PAGE_OFFSET = 0;

let productController = {
  getProducts: (req, res) => {
    Product.findAndCountAll({
      offset: PAGE_OFFSET,
      limit: PAGE_LIMIT,
      raw: true,
      nest: true
    }).then(products => {
      return Cart.findByPk(req.session.cartId, { include: 'items' }).then(cart => {
        cart = cart || { items: [] }
        let totalPrice = cart.items.length > 0 ? cart.items.map(d => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0
        if (cart.items.length > 0) {
          cart = cart.toJSON()
        }
        return res.render('products', {
          products,
          cart,
          totalPrice,
        })
      })
    })
  },
}

module.exports = productController