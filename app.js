const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

//OUR OWN IMPORTS FROM OUR OWN MODULES
const adminRoutes = require('./routes/admin');
const shopRouting = require('./routes/shop');
const errorController = require('./controllers/error');

//const rootDir = require('./util/path')

const app = express();
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

//USE HANDLEBARS
//const expressHbs = require('express-handlebars');
//app.engine('handlebars', expressHbs({layoutsDir: 'views/Layouts/' , defaultLayout: 'main-layout' , extname: 'handlebars' }));
//app.set('view engine', 'handlebars');
//-----------------------------------------------------------------------------------------
//USE PUG
// app.set('view engine', 'pug');
//-----------------------------------------------------------------------------------------
app.set('view engine', 'ejs');
app.set('views', 'views');



app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req,res,next) => {
    User.findByPk(1)
    .then(user => {
        req.user = user;
        next();
    })
    .catch(err => console.log(err));
})

app.use('/admin', adminRoutes);
app.use(shopRouting);

app.use(errorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

sequelize
    //.sync({force: true})
    .sync()
    .then(result => {
        return User.findByPk(1)
    })
    .then(user => {
        if (!user) {
            return User.create({ name: 'omnia', email: 'Omnia@omnia.com' })
        }
        return user;
    })
    .then(user => {
        return user.createCart()
    })
    .then(cart => {
        app.listen(3000);
    })

    .catch(err => {
        console.log(err);
    })
