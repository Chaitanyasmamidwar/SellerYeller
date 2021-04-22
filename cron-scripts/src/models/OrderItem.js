import mongoose from 'mongoose'

const MODEL_NAME = 'order-item'

const Schema = new mongoose.Schema({
    ASIN: String,
    OrderItemId: String,
    SellerSKU: String,
    Title: String,
    QuantityOrdered: Number,
    ItemPrice: Number,
    OrderId: String,
})

export default mongoose.models[MODEL_NAME] || mongoose.model(MODEL_NAME, Schema)
