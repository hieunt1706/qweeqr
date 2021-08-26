const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('express-flash')
const passport = require('passport')
require('./models/passport.model')(passport)

const indexRouter = require('./routes/index')
const categoryRouter = require('./routes/category')
const productRouter = require('./routes/product')
const cartRouter = require('./routes/cart')
const userRouter = require('./routes/user')
const adminRouer = require('./routes/admin')

const app = express()
const methodOverride = require('method-override')
require('dotenv').config()

const connectFun = async()=>{
    try {
        await mongoose.connect('mongodb+srv://nt13:nt13@cluster0.mdnnq.mongodb.net/Bai6?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        })
        console.log("Success")
    } catch (error) {
        console.log(error)
        console.log("Fail")
    }
}

connectFun()
app.use(flash())
app.use(methodOverride('_method'))
app.set('view engine', 'ejs')
app.use(expressLayouts)
app.set('layout', 'layouts/layout')
app.use(express.static('public'))
app.use(express.urlencoded({extended: false, limit: '10mb'}))
app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie:  { maxAge: 60*60*1000}
  }))
app.use((req, res, next) => {
    res.locals.session = req.session;
    next()
})
app.use(passport.initialize())
app.use(passport.session())

app.use('/', indexRouter)
app.use('/category', categoryRouter)
app.use('/product', productRouter)
app.use('/cart', cartRouter)
app.use('/user', userRouter)
app.use('/admin', adminRouer)
app.listen(3000)
