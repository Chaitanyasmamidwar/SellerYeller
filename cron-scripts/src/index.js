import dotenv from 'dotenv'
import './initDb'
import cron from 'node-cron'
import { scheduleEmails } from './scheduleEmails'
import { createOrderReports, getReport, processOrderReport } from './loadReports'

dotenv.config()

console.log("RUNGIING INDEX FILE:::")

// const ordersCron = cron.schedule('*/1 * * * *', () => {
    // console.log(" SEND orders::::", new Date())
    // createOrderReports()
// })
// const emailScheduleCron = cron.schedule('*/1 * * * *', () => {
    // console.log(" Schedule EMAIL::::", new Date())
    // scheduleEmails()
// })
// const emailSendCron = cron.schedule('*/1 * * * *', () => {
    // console.log(" SEND EMAIL::::", new Date())
// })
// 

// loadOrders()
scheduleEmails()
// createOrderReports()
// getReport()
// processOrderReport()


