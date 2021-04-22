import dotenv from 'dotenv'
import './initDb'
import loadOrders from './loadOrders'
import { scheduleEmails } from './scheduleEmails'

dotenv.config()

console.log("RUNGIING INDEX FILE:::")
// loadOrders()
scheduleEmails()
