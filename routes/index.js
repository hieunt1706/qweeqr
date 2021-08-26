const express = require('express')
const productModel = require('../models/product.model')
const categoryModel = require('../models/category.model')
const router = express.Router()

router.get('/', async (req, res) => {
    const products = await productModel.find()
    const categories = await categoryModel.find()
    res.render('index', {products: products, categories: categories, title: "List Product"})
})
module.exports = router