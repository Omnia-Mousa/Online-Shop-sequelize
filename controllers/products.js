//const products = [];
const Product = require('../models/product')

exports.getAddProduct =  (req, res, next) => {
    // res.sendFile(path.join(rootDir, 'views', 'add-product.html')); 
    res.render('add-product', 
    {
      pageTitle: 'Add Product',
      path : '/admin/add-product',
      activeAddProduct: true,
      formsCSS: true,
      productCSS:true
     });
   };

exports.postAddProduct =  (req, res, next) => {
    //products.push({title: req.body.title});
    const product = new Product(req.body.title);
    product.save();
    res.redirect('/');
  };

exports.getProducts =  (req, res, next) => {
    // console.log(adminData.products);
    // res.sendFile(path.join(rootDir, 'views', 'shop.html'));
    //const products = adminData.products;

    const products = Product.fetchAll(products => {
      res.render('shop',
      {
        prods : products, 
        pageTitle : 'Shop',
        path: '/shop',
        hasProducts: products.length > 0,
        activeShop: true,
        productCSS: true
      });
    });
  };