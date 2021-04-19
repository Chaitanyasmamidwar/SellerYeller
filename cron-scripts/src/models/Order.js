import mongoose from 'mongoose'

const MODEL_NAME = 'order'
const OrderSchema = new mongoose.Schema({
    AmazonOrderId: String,
    PurchaseDate: Date,
    LastUpdateDate: Date,
    OrderStatus: String,
    OrderTotal: Number,
    MarketplaceId: String,
    EasyShipShipmentStatus: String,
    LatestDeliveryDate: Date,
    SellerId: String,
    BuyerEmail: String,
    BUynerName: String,
})

const Order = mongoose.models[MODEL_NAME] || mongoose.model(MODEL_NAME, OrderSchema)

export default Order