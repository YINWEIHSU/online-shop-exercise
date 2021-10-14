const express = require('express');
const router = express.Router();
const passport = require('passport')
const productController = require('../controllers/productController.js')
const cartController = require('../controllers/cartController.js')
const orderController = require('../controllers/orderController.js');
const userController = require('../controllers/userController.js');
const adminController = require('../controllers/adminController')
const app = require('../app.js');
const { checkIfUser, checkIfAdmin } = require('../config/authenticators')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

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

router.get('/admin', checkIfAdmin, (req, res, next) => {
  res.render('adminIndex', { layout: 'admin' });
})
router.get('/admin/login', adminController.signInPage)
router.post('/admin/login', passport.authenticate('local', {
  failureRedirect: '/admin/login'
}), adminController.signIn)
router.get('/admin/orders', checkIfAdmin, adminController.getOrders)
router.get('/admin/orders/:id', checkIfAdmin, adminController.getOrder)
router.get('/admin/products', checkIfAdmin, adminController.getProducts)
router.get('/admin/customers', checkIfAdmin, adminController.getCustomers)
router.get('/admin/products/create', checkIfAdmin, adminController.createProduct)
router.put('/admin/products/:id', checkIfAdmin, upload.single('image'), adminController.putProduct)
router.get('/admin/products/:id', checkIfAdmin, adminController.getProduct)
router.post('/admin/products', checkIfAdmin, upload.single('image'), adminController.postProduct)



module.exports = router;
