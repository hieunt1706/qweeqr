const express=require('express')
const categoryModel=require('../models/category.model')
const productModel=require('../models/product.model')
const router=express.Router()

router.get('/', async (req, res) => {
    try {
        const products = await productModel.find().populate('category', ['name'])
        res.render('products/list', {products: products})
    } catch (error) {
        res.redirect('/')
    }
})

router.get('/add',async(req,res)=>{
    const product=new productModel()
    const categories=await categoryModel.find()
    res.render('products/add',{product:product,categories:categories})
})

router.get('/edit/:id',async(req,res)=>{
    try{
        const product = await productModel.findById(req.params.id)
        const categories = await categoryModel.find()
        res.render('products/edit',{product: product, categories:categories})
    }catch(e){
        console.log(e)
        res.redirect('/')
    }
    
})

router.get('/:id', async(req,res)=>{
    try {
        const product = await productModel.findById(req.params.id)
        res.render('detail/detail',{product: product})
    } catch (error) {
        res.redirect('/')
    }
})

router.post('/',async(req,res)=>{
    try{
        const productNew=new productModel({
            name:req.body.name,
            info:req.body.info,
            quantity:req.body.quantity,
            price:req.body.price,
            category:req.body.category,
        })

        if(req.body.image != null && req.body.image != ''){
            const image = JSON.parse(req.body.image)
            productNew.imageType = image.type
            productNew.imageData = new Buffer.from(image.data, 'base64')
        }
    
        await productNew.save()
        res.redirect('/admin')
     
    }catch(e){
        console.log(e)
        res.redirect('/')
    }
})

router.put('/:id', async(req, res) => {
    try {
        let product= await productModel.findById(req.params.id)
        product.name = req.body.name
        product.info = req.body.info
        product.quantity = req.body.quantity
        product.price = req.body.price
        product.category = req.body.category

        if(req.body.image != null && req.body.image != ''){
            const image = JSON.parse(req.body.image)
            product.imageType = image.type
            product.imageData = new Buffer.from(image.data, 'base64')
        }

        await product.save()
        res.redirect('/admin')
    } catch (error) {
        console.log(error)
    }
})

router.post('/search', async (req, res) => {
    const keyword = req.body.key
    try {
        var products = await productModel.find()
        var list = []
        for (const iterator of products) {
            var name = iterator.name.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            var key = keyword.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            if (name.indexOf(key) >= 0){
                list.push(iterator)
            }
        }
        res.render('search/search', {products: list, title: "Search by: " + keyword})
    } catch (error) {
        res.redirect('/')
    }
    
    //console.log(products);
    //res.render('search/search', products)
})

router.delete('/delete/:id',async(req,res)=>{
    try{
        const productDelete=await productModel.findById(req.params.id)
        await productDelete.remove()
        res.redirect('/product')
    }catch(e){
        console.log(e)
        res.redirect('/')
    }
})


module.exports=router