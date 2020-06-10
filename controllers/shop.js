const Product = require('../models/product');
const Cart = require('../models/cart');
const Order = require('../models/order')

const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const stripe = require('stripe')('sk_test_51GsOogE921f4ghbZTvt5oEvLQBfum1nAdCuHbOMSyHCQMrCMGkpENZAuXff8QuU8I2nZQ68Afq8sbe8V1tBBSbeu00KgE8w86h');

exports.getProducts = (req, res, next) => {
  Product.findAll()
  .then(products => {
    res.render('shop/product-list',
      {
        prods: products,
        pageTitle: 'All Products',
        path: '/products',
        hasProducts: products.length > 0
      });
  })
  .catch(err => {
    console.log(err);
  })
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findAll({ where: { id: prodId } })
    .then(products => {
      res.render('shop/product-detail', {
        product: products[0],
        pageTitle: products[0].title,
        path: '/products'
      });
    })
    .catch(err => console.log(err));
  // Product.findById(prodId)
  //   .then(product => {
  //     res.render('shop/product-detail', {
  //       product: product,
  //       pageTitle: product.title,
  //       path: '/products'
  //     });
  //   })
  //   .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
  .then(products => {
    res.render('shop/index',
    {
      prods: products,
      pageTitle: 'Shop',
      path: '/shop',
      hasProducts: products.length > 0
    });
  })
  .catch(err => {
    console.log(err);
  })
};

exports.getCart = (req, res, next) => {
  req.user
  .getCart()
  .then(cart => {
    return cart
    .getProducts()
    .then(products => {
      res.render('shop/cart',
        {
          pageTitle: 'Cart',
          path: '/cart',
          products: products
        });
    })
    .catch(err => console.log(err));
  })
  .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchedCart;
  let newQantity = 1;
 req.user
 .getCart()
 .then(cart => {
  fetchedCart = cart;
   return cart.getProducts({where : {id : prodId}});
 })
   .then(products => {
     let product;
     if( products.length > 0){
       product = products[0];
     }
     if(product){
       const oldQuantity = product.cartItem.quantity;
       newQantity = oldQuantity + 1;
       return product;
     }
     return Product.findByPk(prodId)
   })
   .then(product => {
    return fetchedCart.addProduct(product , {
      through : {quantity : newQantity}
    })
   })
   .then(()=> {
     res.redirect('/cart')
   })
   .catch(err => console.log(err))
 };


exports.postCartDeleteProduct = (req, res, next) =>{
  const prodId = req.body.productId;
  req.user
  .getCart()
  .then(cart =>{
    return cart.getProducts({where : {id : prodId}})
  })
  .then(products => {
    const product = products[0];
    return product.cartItem.destroy();
  })
  .then(result => {
    res.redirect('/cart');
  })
}

exports.getCheckout = (req , res , next) => {
  req.user
  .getCart()
  .then(cart => {
    return cart
    .getProducts()
    .then(products => {
        let total = 0;
        products.forEach(p => {
          total += p.cartItem.quantity * p.price;
        }); 
      res.render('shop/checkout',
        {
          pageTitle: 'checkout',
          path: '/checkout',
          products: products,
          totalSum : total
        });
    })
    .catch(err => console.log(err));
  })
  .catch(err => console.log(err));
} 

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  // Token is created using Checkout or Elements!
  // Get the payment token ID submitted by the form:
  // Using Express
  const token = req.body.stripeToken;
  let totalSum = 0;
  let orderId =0;

  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then(products => {
      products.forEach(p => {
        totalSum += p.cartItem.quantity * p.price;
        });
      return req.user
        .createOrder()
        .then(order => {
          orderId = order.dataValues.id;
          return order.addProducts(
            products.map(product => {
              product.orderItem = { quantity: product.cartItem.quantity };
              return product;
            })
          );
        })
        .catch(err => console.log(err));
    })
    .then(result => {
      const charge = stripe.charges.create({
                amount: totalSum * 100,
                currency: 'usd',
                description: 'Demo Order',
                source: token,
                metadata: { order_id: orderId}
              });
      return fetchedCart.setProducts(null);
    })
    .then(result => {
      res.redirect('/orders');
    })
    .catch(err => console.log(err));
};


exports.getOrders = (req, res, next) => {
  req.user
    .getOrders({include: ['products']})
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders
      });
    })
    .catch(err => console.log(err));
 };


 exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  Order.findByPk(orderId)
    .then(order => {
      if (!order) {
        return next(new Error('No order found.'));
      }
      const invoiceName = 'invoice-' + orderId + '.pdf';
      const invoicePath = path.join('data', 'invoices', invoiceName);
      const pdfDoc = new PDFDocument();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        'inline; filename="' + invoiceName + '"'
      );
      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res);

      pdfDoc.fontSize(26).text('Invoice', {
        underline: true
      });
      pdfDoc.text('-----------------------');
      let totalPrice = 0;
      order.getProducts()
      .then(products => {
        console.log(products)
        products.forEach(prod => {
          totalPrice += prod.orderItem.quantity * prod.dataValues.price;
          pdfDoc
            .fontSize(14)
            .text(
              prod.dataValues.title +
                ' - ' +
                prod.orderItem.quantity +
                ' x ' +
                '$' +
                prod.dataValues.price
            );
        });
        pdfDoc.text('---');
        pdfDoc.fontSize(20).text('Total Price: $' + totalPrice);
        pdfDoc.end();
      })
      })  
      .catch(err => next(err));
};
