const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const productSchema = new mongoose.Schema({
    name:String,
    description:String,
    quantity:String,
    price:String,
    createdBy:{
        type:ObjectId,
        ref:"User"
    }
});

module.exports = mongoose.model("Product",productSchema);