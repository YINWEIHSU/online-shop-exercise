const express = require('express');
const router = express.Router();
const passport = require('passport')
const productController = require('../controllers/productController.js')
const cartController = require('../controllers/cartController.js')
const orderController = require('../controllers/orderController.js');
const userController = require('../controllers/userController.js');
const adminController = require('../controllers/adminController')
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

router.get('/order', orderController.getOrder)
router.post('/order', orderController.postOrder)
router.post('/order/:id/cancel', orderController.cancelOrder)

router.get('/order/:id/payment', orderController.getPayment)
router.post('/newebpay/callback', orderController.newebpayCallback)

router.get('/admin', (req, res, next) => {
  res.render('adminIndex', { layout: 'admin' });
})
router.get('/admin/login', adminController.signInPage)
router.post('/admin/login', adminController.signIn)
router.get('/admin/orders', adminController.getOrders)
router.get('/admin/orders/:id', adminController.getOrder)
router.get('/admin/products', adminController.getProducts)
router.get('/admin/customers', adminController.getCustomers)



module.exports = router;
