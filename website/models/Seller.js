import mongoose, { Schema, model } from 'mongoose'

const SellerSchema = new Schema({
    marketplaceId: String,
    refreshToken: String,
    name: String,
    email: String,
    sellerId: String,
    productFilter: Array,
})
const SellerModel = mongoose.models['seller'] || model('seller', SellerSchema)

export default SellerModel