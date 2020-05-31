const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

//OUR OWN IMPORTS FROM OUR OWN MODULES
const adminRoutes = require('./routes/admin');
const shopRouting = require('./routes/shop');
const errorController = require('./controllers/error');

//const rootDir = require('./util/path')

const app = express();

//USE HANDLEBARS
//const expressHbs = require('express-handlebars');
//app.engine('handlebars', expressHbs({layoutsDir: 'views/Layouts/' , defaultLayout: 'main-layout' , extname: 'handlebars' }));
//app.set('view engine', 'handlebars');
//-----------------------------------------------------------------------------------------
//USE PUG
// app.set('view engine', 'pug');
//-----------------------------------------------------------------------------------------
app.set('view engine', 'ejs');
app.set('views','views');



app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, "public")));

app.use('/admin', adminRoutes);
app.use(shopRouting);

app.use(errorController.get404);
app.listen(3000);
