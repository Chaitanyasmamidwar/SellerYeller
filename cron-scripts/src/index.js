import dotenv from 'dotenv'
import './initDb'
import loadOrders from './loadOrders'

dotenv.config()

console.log("RUNGIING INDEX FILE:::")
loadOrders()
