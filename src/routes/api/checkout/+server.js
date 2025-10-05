import { PRICE_ID, STRIPE_API_KEY } from '$env/static/private';
import { PUBLIC_FRONTEND_URL} from '$env/static/public'
import {json} from '@sveltejs/kit'
import Stripe from "stripe";

const stripe = new Stripe(STRIPE_API_KEY);

export async function POST({request}) {
    try {
        console.log(stripe);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: PRICE_ID,
                    quantity: 1,
                }
            ],
            mode: "payment",
            success_url: `${PUBLIC_FRONTEND_URL}/checkout/success`,
            cancel_url: `${PUBLIC_FRONTEND_URL}/checkout/failure`,
        });

        console.log('Session created: ', session.id);
        console.log('Session URL: ', session.url);


        if (!session.url) {
            throw new Error('Session URL is undefined')
        }

        return json({ url: session.url });
    } catch (error) {
        console.log("Stripe error: ", error);
        return json({error}, {status: 500});
    }

    
}