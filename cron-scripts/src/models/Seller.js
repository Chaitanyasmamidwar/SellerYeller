import mongoose from 'mongoose'

const SellerSchema = new mongoose.Schema({
    marketplaceId: String,
    refreshToken: String,
    name: String,
    email: String,
    sellerId: String,
    productFilter: Array,
})
const Seller = mongoose.models['seller'] || mongoose.model('seller', SellerSchema)

export default Seller