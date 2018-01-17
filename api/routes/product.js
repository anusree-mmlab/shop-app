var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/product.model');
const Authorization = require('../middlewares/check-auth');

router.get('/',(req, res, next) => {
    Product.find().exec().
    then((result) => {
        res.status(200).json({
            message: `product list`,
            result: result
        });
    }).catch(err => {console.log(err);
        res.status(500).json({
            message: 'error occured during prod fetch'
        })
    });
});

router.get('/:productId',(req, res, next) => {
    Product.findById(req.params.productId).exec().
    then((result) => {
        res.status(200).json({
            message: `product with id ${req.params.productId}`,
            result: result
        });
    }).catch(err => {console.log(err);
        res.status(500).json({
            message: 'error occured during prod fetch'
        })
    });
    
});

router.post('/',Authorization,(req, res, next) => {
    const newProduct = new Product(
        {
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            price: req.body.price
        }
    );
    
    newProduct.save().
    then((result) => {
        res.status(200).json({
            message: `new porduct`,
            product: newProduct
        });
    }).
    catch((error) => {
        res.status(500).json({
            message: 'error occured during prod create'
        })
    });
});

module.exports = router;