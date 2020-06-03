const fs = require('fs');
const path = require('path');

const _path = path.join(
    path.dirname(process.mainModule.filename) ,
     'data' ,
    'cart.json'
);

module.exports = class Cart {
    static addProduct(id, productPrice){
        //Fetch The Previous Cart
        fs.readFile(_path , (err,fileContent) => {
            let cart ={products: [] , totalPrice: 0};
            if(!err){
                cart = JSON.parse(fileContent);
            }
            //Analyze The Cart / Increase quantity
            const existiogProdIndex = cart.products.findIndex(prod => prod.id === id);
            const existingProduct = cart.products[existiogProdIndex];
            let updatedProduct ;
            //Add new Product
            if(existingProduct){
                updatedProduct = {...existingProduct};
                updatedProduct.qty = updatedProduct.qty + 1;
                cart.products = [...cart.products];
                cart.products[existiogProdIndex] = updatedProduct;
            }else {
                updatedProduct = {id: id , qty: 1};
                cart.products = [...cart.products, updatedProduct];
            }
            //to Insure that the total price will be computed as number we should add + +productPrice
            cart.totalPrice = cart.totalPrice + +productPrice;
            fs.writeFile(_path , JSON.stringify(cart) , err => {
                console.log(err);
            })
        })
    }
    static deleteProduct(id, productPrice) {
        fs.readFile(_path, (err, fileContent) => {
          if (err) {
            return;
          }
          const updatedCart = { ...JSON.parse(fileContent) };
          const product = updatedCart.products.find(prod => prod.id === id);
          if(!product){
              return;
          }
          const productQty = product.qty;
          updatedCart.products = updatedCart.products.filter(
            prod => prod.id !== id
          );
          updatedCart.totalPrice =
            updatedCart.totalPrice - productPrice * productQty;
    
          fs.writeFile(_path, JSON.stringify(updatedCart), err => {
            console.log(err);
          });
        });
      }

      static getCart(cb){
        fs.readFile(_path, (err,fileContent) =>{
          const cart = JSON.parse(fileContent)
          if(err){
            cb(null);
          }else
          {
            cb(cart);
          }
        })
      }
    
}

