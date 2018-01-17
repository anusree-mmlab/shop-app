const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
var mongoose = require('mongoose');

//MongoDB Connect
mongoose.connect('mongodb://shop-app:'+process.env.DB_PASS+'@cluster0-shard-00-00-hffrs.mongodb.net:27017,cluster0-shard-00-01-hffrs.mongodb.net:27017,cluster0-shard-00-02-hffrs.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin',{
    useMongoClient : true
})
mongoose.Promise = require('bluebird');


const productRoutes = require('./api/routes/product');
const userRoutes = require('./api/routes/user');



//Access control origin alow.
/* app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","Origin, Content-Type, Accept");

    if(req.method === 'OPTIONS') {
        res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,PATCH");
        return res.status(200).json({});
    }
}); */

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(morgan("dev"));


app.use('/products',productRoutes);
app.use('/users',userRoutes);

app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(error);
});
app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        error : {
            message: error.mesage || 'Error occured'
        }
    });
});



module.exports = app;