import mongoose from 'mongoose'

const MODEL_NAME = 'order'

const OrderItemSchema = new mongoose.Schema({
    ASIN: String,
    AmazonOrderItemId: String,
    SKU: String,
    ProductName: String,
    Quantity: Number,
    ItemPrice: Object,
})

const OrderSchema = new mongoose.Schema({
    AmazonOrderID: String,
    PurchaseDate: Date,
    LastUpdatedDate: Date,
    OrderStatus: String,
    SellerId: String,
    OrderItem: OrderItemSchema,
})

const Order = mongoose.models[MODEL_NAME] || mongoose.model(MODEL_NAME, OrderSchema)

export default Order