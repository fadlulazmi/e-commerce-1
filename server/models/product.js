const mongoose = require('mongoose');
const {Schema} = mongoose;

let productSchema = new Schema ({
    itemName : String,
    stock : Number,
    price : Number,
    img : String,
    category: String,
    description : String
})

let Product = mongoose.model('Product', productSchema)

module.exports = Product