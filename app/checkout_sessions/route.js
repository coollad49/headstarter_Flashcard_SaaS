import { NextResponse } from "next/server";
import https from "https";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export async function POST(req) {
  const params = JSON.stringify({
    "email": "customer@email.com",
    "amount": formatAmountForPaystack(10),  // Convert $10 to kobo
  });

  const options = {
    hostname: 'api.paystack.co',
    port: 443,
    path: '/transaction/initialize',
    method: 'POST',
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
  };

  return new Promise((resolve, reject) => {
    const paystackReq = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve(NextResponse.json(JSON.parse(data), { status: 200 }));
      });
    }).on('error', (error) => {
      reject(NextResponse.json({ error: error.message }, { status: 500 }));
    });

    paystackReq.write(params);
    paystackReq.end();
  });
}

const formatAmountForPaystack = (amount) => {
  return Math.round(amount * 100 * 700); // Example conversion from USD to NGN (assuming $1 = ₦700)
};
