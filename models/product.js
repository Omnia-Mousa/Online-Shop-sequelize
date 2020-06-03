//const products = []
//************ SAVE IN FILES INSTEAD OF ARRAY **************/
const fs = require('fs');
const path = require('path');

const Cart = require('./cart')

const _path = path.join(
    path.dirname(process.mainModule.filename) ,
     'data' ,
    'products.json'
);

const getProductsFromFile = callBack => {
    fs.readFile(_path, (err,fileContent)=> {
        if(err){
            callBack([]);
        }
        else {
        callBack(JSON.parse(fileContent))
        }
    })
}


module.exports = class Product {

    constructor(id,_title , _imageUrl , _price , _description){
        this.id = id;
        this.title = _title;
        this.imageUrl = _imageUrl;
        this.price = _price;
        this.description = _description;
    }

    save(){
        getProductsFromFile(products => {
            if(this.id){
                const existingProdIndex = products.findIndex(prod => prod.id === this.id);
                const upadtedProducts = [...products];
                upadtedProducts[existingProdIndex] = this;
                fs.writeFile(_path , JSON.stringify(upadtedProducts) , (error)=> {
                    console.log(error);
                })
            }
            else {
                this.id = Math.random().toString();
                products.push(this);
                fs.writeFile(_path , JSON.stringify(products) , (error)=> {
                    console.log(error);
                })
            }
        })
    }

    static deleteById(id) {
        getProductsFromFile(products => {
          const product = products.find(prod => prod.id === id);
          const updatedProducts = products.filter(prod => prod.id !== id);
          fs.writeFile(_path, JSON.stringify(updatedProducts), err => {
            if (!err) {
              Cart.deleteProduct(id, product.price);
            }
          });
        });
      }

    static fetchAll(callBack){
        getProductsFromFile(callBack);
    }

    static findByID(id,cb){
        getProductsFromFile(products => {
            const product = products.find(p => p.id === id);
            cb(product)
        })
    }
}