// import and initializes the Stripe library using the secret key from environement variables.
// process.env.STRIPE_SECRET_KEY hold the secret API key, allowing secure interaction with Stripe API.
import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

import { type NextRequest } from 'next/server'
import db from '@/utils/db'
import { formatDate } from '@/utils/format'

export const POST = async (req: NextRequest) => {
    // This extracts headers from req to get the header, which represents the base URL of the request's origin
    const requestHeaders = new Headers(req.headers)
    const origin = requestHeaders.get('origin')
    // Reads the Json body of the request to get bookingId which will be used to look up the specific booking information in the database.
    const { bookingId } = await req.json()
    //queries the bookings table in the database to find a booking that matches bookingId.
    const booking = await db.booking.findUnique({
        where: { id: bookingId },
        include: {
            property: {
                select: {
                    name: true,
                    image: true,
                },
            },
        },
    })
    // checking for missing booking 
    if (!booking) {
        return Response.json(null, {
            status: 404,
            statusText: 'Not Found',
        })
    }
    // extracting booking data 
    const {
        totalNights,
        orderTotal,
        checkIn,
        checkOut,
        property: { image, name },
    } = booking

    try {
        // Create a Stripe payment Session
        const session = await stripe.checkout.sessions.create({
            ui_mode: 'embedded',
            metadata: { bookingId: booking.id },
            line_items: [
                {
                    quantity: 1,
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `${name}`,
                            images: [image],
                            description: `Stay in this wonderful place for 
                            ${totalNights} nights, from ${formatDate(checkIn)
                                } to ${formatDate(checkOut)}.Enjoy your stay!`,
                        },
                        unit_amount: orderTotal * 100,
                    },
                },
            ],
            mode: 'payment',
            // Redirects the user to a confirmation page at the end of checkout.
            //inclues the session ID in the URL as 
            return_url: `${origin}/api/confirm?session_id={CHECKOUT_SESSION_ID}`,
        });
        return Response.json({ clientSecret: session.client_secret })
    } catch (error) {
        console.log(error)
        return Response.json(null, {
            status: 500,
            statusText: 'Internal Server Error',
        })
    }
}
