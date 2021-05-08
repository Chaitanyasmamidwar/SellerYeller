import { sub } from "date-fns"
import _ from 'lodash'

import Order from "./models/Order"
import EmailEvent from "./models/EmailEvent"
import { buildSpApiConnector } from "./spAPIHelper"
import OrderBuyerInfo from "./models/OrderBuyerInfo"
import Seller from "./models/Seller"

const DELIVERED_ORDER_STATUS = 'Shipped - Delivered to Buyer'

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

    const last2Weeks = sub(new Date(), { days: 30 })
    const criteria = { 
        LastUpdatedDate: { $gt: last2Weeks },
        OrderStatus: DELIVERED_ORDER_STATUS,
        // EasyShipShipmentStatus: 'Delivered',
    }
    console.log("DATE:::::", last2Weeks, DELIVERED_ORDER_STATUS)

    const orders = await Order.find({ 
        LastUpdatedDate: { $gt: last2Weeks },
        OrderStatus: DELIVERED_ORDER_STATUS,
        // EasyShipShipmentStatus: 'Delivered',
    })


    const filteredOrders = await applyProductFilterOnOrders(orders)
    const orderIds = filteredOrders.map(order => order.AmazonOrderID)
    const existingEvents = await EmailEvent.find({ orderId: orderIds })

    const newOrders = _.differenceBy(
        filteredOrders,
        existingEvents,
        orderOrEvent => orderOrEvent.AmazonOrderID || orderOrEvent.orderId,
    )

    const newEvents = await Promise.all(newOrders.map(createEventFromOrder))

    console.log("NEW EVENTSS:::::", newEvents)

    EmailEvent.insertMany(newEvents)
    // event table contains record with all the detials of the email
}

async function createEventFromOrder(order) {
    const emailTemplate = 'This is a sample template for an email'
    const sellerApi = await buildSpApiConnector(order.SellerId)
    const result = await sellerApi.callAPI({
        operation: 'getOrderBuyerInfo',
        path: {
            orderId: order.AmazonOrderID,
        },
    })
    const buyer = new OrderBuyerInfo(result)

    return {
        orderId: order.AmazonOrderID,
        isEmailScheduled: false,
        emailTemplate,
        buyer,
    }
}

async function applyProductFilterOnOrders(orders) {
    const sellers = await Seller.find({ sellerId: orders.map(o => o.SellerId)})
    const sellersById = _.keyBy(sellers, 'sellerId')

    const ordersBySellerIdAndASIN = orders.reduce((acc, order) => {
        if(sellersById[order.SellerId].productFilter.includes(order.OrderItem.ASIN)) {
            acc.push(order)
        }

        return acc
    }, [])

    return ordersBySellerIdAndASIN
}

/*
    Test Product filter
    convert programs to cron
    setup mail server
    send email
*/