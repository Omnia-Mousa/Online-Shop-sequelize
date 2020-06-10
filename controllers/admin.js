const Product = require('../models/product')

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product',
    {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false
    });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  req.user.createProduct({
    title: title,
    imageUrl: imageUrl,
    price: price,
    description: description
  })
    .then(result => {
      console.log('product is created');
      res.redirect('/admin/products')
    }).catch(err => {
      console.log(err);
    })
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  req.user
    .getProducts({ where: { id: prodId } })
    // Product.findById(prodId)
    .then(products => {
      const product = products[0];
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product
      });
    })
    .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedimageUrl = req.body.imageUrl;
  const updatedPrice = req.body.price;
  const updateddescription = req.body.description;
  Product.findAll({ where: { id: prodId } })
    .then(products => {
      products[0].title = updatedTitle;
      products[0].imageUrl = updatedimageUrl;
      products[0].price = updatedPrice;
      products[0].description = updateddescription;
      return products[0].save();
    })
    .then(result => {
      console.log('Updated Product');
      res.redirect('/admin/products')
    })
    .catch(err => console.log(err))

}

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  /***** FIRSTWAY TO DELETE PRODUCT********/
  // Product.findAll({where : {id : prodId}})
  // .then(products => {
  //   return products[0].destroy();
  // })
  // .then(result => {
  //   res.redirect('/admin/products');
  // })
  // .catch(err => console.log(err))
  /***** SECONDWAY TO DELETE PRODUCT********/
  Product.destroy({ where: { id: prodId } })
    .then(result => {
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};

exports.getAdminProducts = (req, res, next) => {
  req.user.getProducts()
    .then(products => {
      res.render('admin/product-list',
        {
          prods: products,
          pageTitle: 'Admin Product',
          path: '/admin/products',
          hasProducts: products.length > 0
        });
    })
    .catch(err => console.log(err));
};
