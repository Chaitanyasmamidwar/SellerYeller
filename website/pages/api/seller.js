import SellerModel from '../../models/Seller'
import { SP_CLIENT_ID, SP_CLIENT_SECRET } from '../../config';

export default async function (req, res) {
    switch (req.method) {
        case "POST":
            return addSeller(req, res)

        default:
            break;
    }
}

async function addSeller(req, res) {
    const sellerParams = req.body
    const existingSeller = await SellerModel.findOne({sellerId: sellerParams.selling_partner_id})

    if (existingSeller) {
        console.log(sellerParams)
        throw new Error("Seller with same account exists")
    }

    const userTokens = await fetchUserTokens(sellerParams)
    console.log(userTokens, "USER TOKENSS:::")
    const newSeller = new SellerModel({
        name: "Test User 1",
        email: "test@email.com",
        sellerId: sellerParams.selling_partner_id,
        refreshToken: userTokens.refresh_token,
        marketplaceId: 'A21TJRUUN4KGV',
    })

    newSeller.save()
    res.send(newSeller)
}

/* Return type :::
{
  "access_token": "Atza|IQEBLjAsAexampleHpi0U-Dme37rR6CuUpSR",
  "token_type": "bearer",
  "expires_in": 3600,
  "refresh_token": "Atzr|IQEBLzAtAhexamplewVz2Nn6f2y-tpJX2DeX"
}
*/
async function fetchUserTokens(sellerParams) {
    const body = {
        grant_type: 'authorization_code',
        code: sellerParams.spapi_oauth_code,
        client_id: SP_CLIENT_ID,
        client_secret: SP_CLIENT_SECRET,
    }
    const authUri = `https://api.amazon.com/auth/o2/token`
    const result = await fetch(authUri, 
        {
            method: 'POST',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        })

    if (result.status !== 200) {
        console.log(result)
        throw new Error("could not fetch token for the user")
    }

    return result.json()
}