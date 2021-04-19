
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
}