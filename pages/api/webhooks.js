import Stripe from "stripe";
import { buffer } from "micro";
import clientPromise from "../../lib/mongodb";

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export default async function handler(req, res) {
  const stripe = new Stripe(stripeSecret);

  if (req.method === "POST") {
    const buf = await buffer(req);
    const sig = req.headers["stripe-signature"]; //stripe signature coming from stripe

    let event;

    try {
      if (!sig || !webhookSecret) return;
      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);

      //only on succesful payments
      if (event.type === "payment_intent.succeeded") {      
        //Grab event data
        const eventObj = event.data.object;
        const auth0Id = eventObj.metadata.sub;

        //Update user token in MongoDB
        const client = await clientPromise;
        const db = client.db("AIBlogGenerator");
        const userProfile = await db.collection("users").updateOne(
          {
            auth0Id: auth0Id,
          },
          {
            $inc: {
              availableTokens: 10,
            },
            $setOnInsert: {
              auth0Id: auth0Id,
            },
          },
          {
            upsert: true,
          }
        );

        //console.log("userProfile:", userProfile);
      } else {
        console.log("Unhandled Stripe event", event.type);
      }
    } catch (error) {
      console.log("Error occurred processing payment", error);
      return res.status(400).send("Error occurred processing payment", error);
    }

    res.status(200).json({ success: true });
  }
}
