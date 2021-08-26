const express = require('express')
const productModel = require('../models/product.model')
const cartModel = require('../models/cart.model')
const orderModel = require('../models/order.model')
const router = express.Router()

router.get('/', async (req, res) => {
    try {
        let carts = []
        if(req.session.cart){
            carts = req.session.cart
        }
         res.render('carts/cart',{carts: carts})
    } catch (error) {
        res.redirect('/')
    }
})

router.get('/add/:id', async (req, res) => {
    try {
        const id = req.params.id
        const product = await productModel.findById(id)
        let items_old = []
        let price_old = 0
        if(req.session.cart){
            items_old = req.session.cart.items
            price_old = req.session.cart.priceTotal
        }
        const cart = new cartModel(items_old, price_old)
        cart.add(product, id, product.imageSrc)
        req.session.cart = cart
        res.redirect('/')
    } catch (error) {
        res.redirect('/')
    }
})

router.get('/checkout', async (req, res) => {
    if(!req.session.cart){
        res.redirect('/cart')
    }
    const cart = req.session.cart
    const total = cart.priceTotal
    res.render('carts/checkout', {products: cart.items, total: total})
})

router.get('/order/:address', async (req, res) => {
    try {
        const cart = new cartModel(req.session.cart)
        const order = new orderModel({
            user: req.user,
            cart: cart,
            address: req.params.address
        })
        req.session.cart = null
        req.flash('success', "Order successfully")
        await order.save()
        res.redirect('/')
    } catch (error) {
        res.redirect('/cart/checkout')
    }
})

router.delete('/delete/:id', async (req, res) => {
    try {
        let items_old = []
        let price_old = 0
        if(req.session.cart){
            items_old = req.session.cart.items
            price_old = req.session.cart.priceTotal
        }
        const cart = new cartModel(items_old, price_old)
        cart.delete(req.params.id)
        req.session.cart = cart
        res.redirect('/cart')
    } catch (error) {
        res.redirect('/')
    }
})

router.get('/reduce/:id', (req, res) => {
    try {
        let items_old = []
        let price_old = 0
        if(req.session.cart){
            items_old = req.session.cart.items
            price_old = req.session.cart.priceTotal
        }
        const cart = new cartModel(items_old, price_old)
        cart.reduce(req.params.id)
        req.session.cart = cart
        res.redirect('/cart')
    } catch (error) {
        res.redirect('/')
    }
})

router.get('/increase/:id', (req, res) => {
    try {
        let items_old = []
        let price_old = 0
        if(req.session.cart){
            items_old = req.session.cart.items
            price_old = req.session.cart.priceTotal
        }
        const cart = new cartModel(items_old, price_old)
        cart.increase(req.params.id)
        req.session.cart = cart
        res.redirect('/cart')
    } catch (error) {
        res.redirect('/')
    }
})

function check(req, res, next) {
    if(req.isAuthenticated()){
        next()
    }
    res.redirect('/')
}

module.exports = router