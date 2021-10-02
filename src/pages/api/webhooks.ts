import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "stream";
import Stripe from "stripe";
import { stripe } from "../../services/stripe";
import { saveSubscription } from "./_lib/manageSubscription";

const convert2Buffer = async (readable: Readable) => {
    const buffer = []

    for await (const chunk of readable) {
        buffer.push(
            typeof chunk === 'string' ? Buffer.from(chunk) : chunk
        )
    }

    return Buffer.concat(buffer)
}

//é necessário exportar essa configuração de dentro de rotas que trabalham com modelos de requisições com 'Stream'
export const config = {
    api: {
        bodyParser: false
    }
}

const relevantEvents = new Set([
    'checkout.session.completed',
    'customer.subscription.updated',
    'customer.subscription.deleted'
])

const stripeWebhook = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const buffer = await convert2Buffer(req)
        const secret = req.headers['stripe-signature']

        let event: Stripe.Event

        try {
            event = stripe.webhooks.constructEvent(buffer, secret, process.env.STRIPE_WEBHOOK_SECRET)
        } catch (error) {
            res.status(400).send(`Webhook error: ${error.message}`)
        }

        const { type } = event

        if (relevantEvents.has(type)) {
            switch (type) {
                case 'customer.subscription.updated':
                case 'customer.subscription.deleted':
                    const subscription = event.data.object as Stripe.Subscription

                    await saveSubscription(
                        subscription.id,
                        subscription.customer.toString(),
                    )

                    break
                case 'checkout.session.completed':
                    const checkoutSessionData = event.data.object as Stripe.Checkout.Session

                    await saveSubscription(
                        checkoutSessionData.subscription.toString(),
                        checkoutSessionData.customer.toString(),
                        true
                    )
                    break
                default:
                    return res.json({ error: 'Webhook handler failed.' })
            }
        }


        res.status(200).json({ ok: true })
    } else {
        res.setHeader('Allow', 'POST')
        res.status(405).end('Method not allowed')
    }
}

export default stripeWebhook