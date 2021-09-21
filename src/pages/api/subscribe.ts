import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { stripe } from "../../services/stripe";

export default async (req: NextApiRequest, res: NextApiResponse) => {

    //A validação dos parâmetros da requisição, tem que ser feito dentro da função
    if (req.method === 'POST') {
        //Recupera os dados do usuário logado através da sessão que está nos cookies
        const session = await getSession({ req })

        //Cria um novo "customer" no stripe, para que o pagamento seja possivel
        const stripeCustomer = await stripe.customers.create({
            email: session.user.email
        })

        //Por fim, cria a subscrição
        const checkoutSession = await stripe.checkout.sessions.create({
            customer: stripeCustomer.id,
            payment_method_types: ['card'],
            billing_address_collection: 'required',
            line_items: [
                {
                    price: 'price_1Jb8URBXpYLZaletzs6qxGXj',
                    quantity: 1
                }
            ],
            mode: 'subscription',
            allow_promotion_codes: true,
            success_url: 'http://localhost:3000/posts',
            cancel_url: 'http://localhost:3000/'
        })

        return res.status(200).json({ sessionId: checkoutSession.id })
    } else {
        res.setHeader('Allow', 'POST')
        res.status(405).end('Method not allowed.')
    }
}