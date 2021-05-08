import mongoose from 'mongoose'
import { Schema as OrderBuyerInfoSchema } from './OrderBuyerInfo'

const MODEL_NAME = 'email-event'
const modelSchema = new mongoose.Schema({
    orderId: String,
    emailTemplate: String,
    isEmailScheduled: Boolean,
    buyer: OrderBuyerInfoSchema,
})

const EmailEvent = mongoose.models[MODEL_NAME] || mongoose.model(MODEL_NAME, modelSchema)

export default EmailEvent
