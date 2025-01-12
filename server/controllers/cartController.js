const Cart = require('../models/cart')

class CartController {
    static create(req, res){
        Cart.create({
            userId : req.loggedUser.id,
            productId : req.body.productId,
            amount: req.body.amount,
        })
            .then(cart => {
                // console.log('cart: ', cart);
                res.status(201).json(cart)
            })
            .catch(err => {
                res.status(500).json(err)
            })
    }

    static findByUser(req, res){
        Cart.find({
            userId : req.params.userId
        })
            .populate('userId')
            .populate('productId')
            .then(data => {
                let amountProduct = {}
                let uniqueProductOnCart = []
                data.forEach(el => {
                    if(!amountProduct[el.productId._id]){
                        amountProduct[el.productId._id] = el.amount
                        uniqueProductOnCart.push(el)
                    } else {
                        amountProduct[el.productId._id] += el.amount
                    }
                })

                let keysAmountProduct = Object.keys(amountProduct)
                uniqueProductOnCart.forEach(cart => {
                    keysAmountProduct.forEach(product => {
                        if(cart.productId._id == product){
                            cart.amount = amountProduct[product]
                        }
                    })
                })
                console.log('uniqueProductOnCart: ', uniqueProductOnCart.length);
                
                res.json(uniqueProductOnCart)
            })
            .catch(err => {
                console.log(err)
                res.status(500).json(err)
            })
    }

    static delete(req, res){
        Cart.findByIdAndDelete(req.params.id)
            .then(deleted => {
                res.json(deleted)
            })
            .catch(err => {
                console.log(err)
                res.status(500).json(err)
            })
    }

    static update(req, res){
        Cart.findByIdAndUpdate(req.params.id, {
            amount : req.body.amount
        }, {
            productId : req.body.productId
        })
            .then(data => {
                res.json({msg : 'updated'})
            })
            .catch(err => {
                console.log(err);
                res.status(500).json(err)
            })
    }
}

module.exports = CartController