const express = require('express');
const router = express.Router();
const passport = require('passport')
const productController = require('../controllers/productController.js')
const cartController = require('../controllers/cartController.js')
const orderController = require('../controllers/orderController.js');
const userController = require('../controllers/userController.js');
const app = require('../app.js');


/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/login', userController.signInPage)
router.post('/signup', userController.signUp)
router.post('/login', passport.authenticate('local', {
  successRedirect: '/products',
  failureRedirect: '/login'
}))

router.get('/products', productController.getProducts)

router.get('/cart', cartController.getCart)
router.post('/cart', cartController.postCart)
router.post('/cartItem/:id/add', cartController.addCartItem)
router.post('/cartItem/:id/sub', cartController.subCartItem)
router.delete('/cartItem/:id', cartController.deleteCartItem)

router.get('/orders', orderController.getOrders)
router.post('/order', orderController.postOrder)
router.post('/order/:id/cancel', orderController.cancelOrder)

module.exports = router;
