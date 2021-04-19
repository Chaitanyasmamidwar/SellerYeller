import mongoose, { Model } from 'mongoose'

const MODEL_NAME = 'allowed-product'
const AllowedProductsSchema = new mongoose.Schema({
    asin: String,
    sellerId: String,
})

const AllowedProduct = mongoose.models[MODEL_NAME] || mongoose.model(MODEL_NAME, AllowedProductsSchema)

export default AllowedProduct