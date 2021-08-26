const express = require('express')
const bcrypt = require('bcrypt')
const userModel = require('../models/user.model')
const passport = require('passport')
const router = express.Router()

router.get('/', async (req, res) => {
    const users = await userModel.find()
    res.render('users/index', {users: users})
})

router.get('/register', async (req, res) => {
    res.render('users/register')
})

router.get('/login', async (req, res) => {
    res.render('users/login')
})

router.get('/profile', (req, res) => {
    req.session.user = req.user
    res.redirect('/')
})

router.get('/logout', async (req, res) => {
    req.logout()
    try {
        delete req.session.user
        res.redirect('/')
    } catch (error) {
        res.redirect('/')
    }
})

router.get('/github', passport.authenticate('github'))

router.get('/github/callback', passport.authenticate('github', {
    successRedirect: '/user/profile',
    failureRedirect: '/user/login',
    failureFlash: true
}))

router.get('/google',passport.authenticate('google',{scope:['profile','email']}))

router.get('/google/callback', passport.authenticate('google', {
    successRedirect: '/user/profile',
    failureRedirect: '/user/login',
    failureFlash: true
}))

router.post('/', async (req, res) => {
    try {
        var hasedPassword = await bcrypt.hash(req.body.password, 10)
        var user = new userModel({
            name: req.body.name,
            email: req.body.email,
            password: hasedPassword
        })
        await user.save()
        req.flash('success', 'Insert succesfull')
        res.redirect('/user')
    } catch (error) {
        req.flash('error', 'Insert failed')
        res.redirect('/')
    }
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/user/profile',   
    failureRedirect: '/user/login',
    failureFlash: true    
}))

router.delete('/:id', async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id)
        await user.remove()
        res.redirect('/admin')
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