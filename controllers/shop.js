const Product = require('../models/product')

exports.getProducts =  (req, res, next) => {
    const products = Product.fetchAll(products => {
      res.render('shop/product-list',
      {
        prods : products, 
        pageTitle : 'All Products',
        path: '/products',
        hasProducts: products.length > 0
      });
    });
  };

  exports.getIndex =  (req, res, next) => {
    const products = Product.fetchAll(products => {
      res.render('shop/index',
      {
        prods : products, 
        pageTitle : 'Shop',
        path: '/shop',
        hasProducts: products.length > 0
      });
    });
  };

exports.getCart =  (req, res, next) => {
  res.render('shop/cart', 
  {
    pageTitle: 'Cart',
    path : '/cart'
   });
 };

 exports.getOrders =  (req, res, next) => {
  res.render('shop/orders', 
  {
    pageTitle: 'Your Orders',
    path : '/orders'
   });
 };

 exports.getCheckout =  (req, res, next) => {
  res.render('shop/checkout', 
  {
    pageTitle: 'Checkout',
    path : '/checkout'
   });
 };