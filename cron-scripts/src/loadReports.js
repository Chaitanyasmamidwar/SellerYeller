import REPORT_DATA from '../report-50014018741.json'
import SellingPartnerAPI from 'amazon-sp-api'
import Seller from './models/Seller'
import Order from './models/Order'
import { truncateExistingOrders } from './loadOrders'

const REPORT_ID = '50676018739'
export async function createOrderReports() {
    const sellers = await Seller.find({ refreshToken: { $exists: true } })

    sellers.forEach(createReport)
}

async function createReport(seller) {
    const spapi = new SellingPartnerAPI({
        region: 'eu',
        refresh_token: seller.refreshToken,
    })

    const res = await spapi.callAPI({
        operation: 'createReport',
        body: {
            reportType: 'GET_XML_ALL_ORDERS_DATA_BY_LAST_UPDATE_GENERAL',
            marketplaceIds: [seller.marketplaceId],
            dataStartTime: '2021-03-25',
            dataEndTime: '2021-04-23',
        }
    });

    console.log(seller.name, "REPORT", res)

    setTimeout(() => getReport(res.reportId, seller), 10000)
}

export async function getReport(reportId = REPORT_ID, seller) {
    seller = seller || await Seller.findOne({ name: "Boyer Mayer", refreshToken: { $exists: true } })

    const spapi = new SellingPartnerAPI({
        region: 'eu',
        refresh_token: seller.refreshToken,
    })

    const report = await getProcessedReport(spapi, reportId)

    if(!report) {
        throw new Error("COuld not generate report")
    }

    console.log(report, "REPORT API RESPONSE:::")
    const reportDocument = await spapi.callAPI({
        operation: 'getReportDocument',
        path: {
            reportDocumentId: report.reportDocumentId,
        },
    });

    const reportData = await spapi.download(reportDocument, { json: true })

    await processOrderReport(reportData, seller)

    console.log(" REPORTS PROCESSED")
}

async function getProcessedReport(spapi, reportId, retryNumber = 7, callback) {
    if (retryNumber < 1) {
        return null
    }

    let report = await spapi.callAPI({
        operation: 'getReport',
        path: {
            reportId,
        },
    })

    retryNumber--

    if (report.processingStatus === 'DONE') {
        return report
    }
    return new Promise(resolve =>
        setTimeout(
            () => {
                resolve(getProcessedReport(spapi, reportId, retryNumber - 1))
            },
            10000,
        )
    )
}

export async function processOrderReport(report, seller) {
    seller = seller || await Seller.findOne({ name: "Boyer Mayer", refreshToken: { $exists: true } })
    report = report || REPORT_DATA

    if(!report?.AmazonEnvelope?.Message) {
        console.log("NO ORDERS TO PROCESS")
        return
    }

    report = report.AmazonEnvelope.Message

    const orders = report.length ? report : [report]

    const formattedOrders = orders.map(message => {
        const order = message.Order

        order.SellerId = seller.sellerId
        return order
    })
    const orderIds = formattedOrders.map(o => o.AmazonOrderID)

    await truncateExistingOrders(orderIds)

    return Order.insertMany(formattedOrders)
}


/*
    Use the data to schedule event
    WHile scheduling event get buyer info and store it in db
    WHile triggering the eent use the buyer info to send emails
*/