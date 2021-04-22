import { sub } from "date-fns"
import _ from 'lodash'

import Order from "./models/Order"
import EmailEvent from "./models/EmailEvent"

export async function scheduleEmails() {
    /*
    1. find all sellers who have refresh token and whose email have to be scheduled
    2-0. Alter order table schema to include email schedule status
    2. for each seller find last 2 weeks orders which are shipped/completed and
        their emails have not been scheduled
    3. For every such order find its order items and check them against the seller
        product filter and filter out such orders
    4-0. Create event table to store email events
    4. for every order present add a event to schedule email
    */

    const last2Weeks = sub(new Date(), { days: 15 })
    console.log("DATE:::::", last2Weeks.toString())

    const orders = await Order.find({ 
        LastUpdateDate: { $gt: last2Weeks },
        OrderStatus: 'Shipped',
        // EasyShipShipmentStatus: 'Delivered',
    })
    const orderIds = orders.map(order => order.AmazonOrderId)
    const existingEvents = await EmailEvent.find({ orderId: orderIds })
    const eventsByOrderId = _.keyBy(existingEvents, 'orderId')

    console.log("EVENTS BY ORDER ID:::::", eventsByOrderId)

    const newEvents = []

    orders.forEach(order => {
        if (!eventsByOrderId[order.AmazonOrderId]) {
            newEvents.push(createEventFromOrder(order))
        }
    })

    console.log("NEW EVENTSS:::::", newEvents)

    EmailEvent.insertMany(newEvents)
    // event table contains record with all the detials of the email
}


function createEventFromOrder(order) {
    const template = 'This is a sample template for an email'

    return {
        orderId: order.AmazonOrderId,
        isEmailScheduled: false,
        template,
    }
}