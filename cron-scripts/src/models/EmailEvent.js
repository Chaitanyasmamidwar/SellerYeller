import mongoose from 'mongoose'

const MODEL_NAME = 'email-event'
const modelSchema = new mongoose.Schema({
    orderId: String,
    emailTemplate: String,
    isEmailScheduled: Boolean,
})

const EmailEvent = mongoose.models[MODEL_NAME] || mongoose.model(MODEL_NAME, modelSchema)

export default EmailEvent
