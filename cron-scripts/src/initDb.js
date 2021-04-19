import mongoose from 'mongoose'
import { MONGODB_URI, DB_NAME, MONGODB_DB } from './config'

mongoose.connect(`${MONGODB_URI}/${MONGODB_DB}`, {useNewUrlParser: true, useUnifiedTopology: true})
