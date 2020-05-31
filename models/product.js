//const products = []
//************ SAVE IN FILES INSTEAD OF ARRAY **************/
const fs = require('fs');
const path = require('path');

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

    constructor(_title){
        this.title = _title;
    }

    save(){
        //products.push(this);
        getProductsFromFile(products => {
            products.push(this);
            fs.writeFile(_path , JSON.stringify(products) , (error)=> {
                console.log(error);
            })
        })
    }

    static fetchAll(callBack){
        getProductsFromFile(callBack);
    }
}