const express = require('express')
const productModel = require('../models/product.model')
const categoryModel = require('../models/category.model')
const userModel = require('../models/user.model')
const orderModel = require('../models/order.model')
const passport = require('passport')
const router = express.Router()

router.get('/', check, async (req, res) => {
    const categories = await categoryModel.find()
    const users = await userModel.find()
    const products = await productModel.find()
    const orders = await orderModel.find()
    res.render('admins/list', {users: users, products: products, categories: categories, orders: orders})
})

router.get('/login', async (req, res) => {
    res.render('admins/login')
})

router.get('/profile', async (req, res) => {
    const user = req.user
    if(user.role){
        req.session.admin = user
        res.redirect('/admin')
    }
    else{
        req.flash('error', 'Login failed')
        res.redirect('/admin/login')
    }
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/admin/profile',   
    failureRedirect: '/admin/login',
    failureFlash: true    
}))

function check(req, res, next) {
    if(req.session.admin){
        next()
    }
    else{
        res.redirect('/admin/login')
    }
}



module.exports = router