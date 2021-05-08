import mongoose from 'mongoose'

const MODEL_NAME = 'order-buyer-info'

export const Schema = new mongoose.Schema({
    BuyerName: String,
    BuyerEmail: String,
    AmazonOrderId: String,
})

export default mongoose.models[MODEL_NAME] || mongoose.model(MODEL_NAME, Schema)