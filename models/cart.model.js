const productModel = require("./product.model")

function cart(items_old, price_old) {
    this.items = items_old
    this.priceTotal = price_old
    this.add = function(product, id, imageSrc){
        const index = this.items.findIndex(s => s.id === id)
        if(index < 0){
            this.items.push({id: id, qty: 1, item: product, imageSrc: imageSrc})  
        }
        else{
            this.items[index].qty++;
        }
        this.price()
    }
    
    this.reduce = function(id){
        const index = this.items.findIndex(s => s.id === id)
        this.items[index].qty--
        if(this.items[index].qty <= 0){
            this.items.splice(index, 1)
        }
        this.price()
    }

    this.increase = function(id){
        const index = this.items.findIndex(s => s.id === id)
        this.items[index].qty++
        this.price()
    }

    this.delete = function(id){
        const index = this.items.findIndex(s => s.id === id)
        this.items.splice(index, 1)
        this.price()
    }

    this.price = function(){
        let price = 0
        for (const iterator of this.items) {
            price += iterator.item.price * iterator.qty
        }
        this.priceTotal = price
    }
    
}



module.exports = cart