'use server';

import {CheckoutOrderParams, CreateOrderParams} from "@/types";
import {redirect} from "next/navigation";
import {connectToDatabase} from "@/lib/database";
import {handleError} from "@/lib/utils";
import Order from "@/lib/database/models/order.model";

export const checkoutOrder = async (order: CheckoutOrderParams) => {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY!);
    const price = order.isFree ? 0 : Number(order.price) * 100;
    try {
        const product = await stripe.products.create({
            name: order.eventTitle,
            description: `Ticket for ${order.eventTitle}`
        })
        const price = await stripe.prices.create({
            product: product.id,
            unit_amount: order.isFree ? 0 : Number(order.price) * 100,
            currency: 'usd',
        })

        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price: price.id,
                    quantity: 1,
                }
            ],
            metadata: {
                eventId: order.eventId,
                buyerId: order.buyerId
            },
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/profile`,
            cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/`,
        });
        redirect(session.url!);
    } catch (e) {
        throw e;
    }
}

export const createOrder = async (order: CreateOrderParams) => {
   try {
       await connectToDatabase();
       const newOrder = await Order.create({
           ...order,
           event: order.eventId,
           buyer: order.buyerId,
       });
       return JSON.parse(JSON.stringify(newOrder));
   } catch (e) {
       handleError(e)
   }
}