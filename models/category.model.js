const mongoose = require('mongoose')
const productModel=require('./product.model')
const categorySchema = new mongoose.Schema({
    name: {type: 'string', required: true, default: 'Banh trang'}
}, {
    timestamps: true
})

categorySchema.pre('remove', async function(next){
    try {
        const products = await productModel.find({category: this._id})
        if(products.length > 0){
            next(new Error('Khong xoa duoc'))
        }
    } catch (error) {
        next()
    }
})

module.exports = mongoose.model('category', categorySchema)