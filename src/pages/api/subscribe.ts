import { NextApiRequest, NextApiResponse } from "next";
import { query as q } from 'faunadb'
import { getSession } from "next-auth/client";
import { faunaClient } from "../../services/fauna";
import { stripe } from "../../services/stripe";

type User = {
    ref: {
        id: string
    },
    data: {
        stripe_customer_id: string
    }
}

const subscribeApi = async (req: NextApiRequest, res: NextApiResponse) => {

    //A validação dos parâmetros da requisição, tem que ser feito dentro da função
    if (req.method === 'POST') {
        //Recupera os dados do usuário logado através da sessão que está nos cookies
        const session = await getSession({ req })
        const storedUser = await faunaClient.query<User>(
            q.Get(
                q.Match(
                    q.Index('find_user_by_email'),
                    q.Casefold(session.user.email)
                )
            )
        )

        let customerId = storedUser.data.stripe_customer_id

        if (!customerId) {
            //Cria um novo "customer" no stripe, para que o pagamento seja possivel
            const stripeCustomer = await stripe.customers.create({
                email: session.user.email
            })

            await faunaClient.query(
                q.Update(
                    q.Ref(q.Collection('users'), storedUser.ref.id),
                    {
                        data: {
                            stripe_customer_id: stripeCustomer.id
                        }
                    }
                )
            )

        }


        //Por fim, cria a subscrição
        const checkoutSession = await stripe.checkout.sessions.create({
            customer: customerId,
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
            success_url: (process.env.NODE_ENV === 'development') ? 'http://localhost:3000/posts' : process.env.APP_URL!,
            cancel_url: (process.env.NODE_ENV === 'development') ? 'http://localhost:3000/' : process.env.APP_URL!
        })

        return res.status(200).json({ sessionId: checkoutSession.id })
    } else {
        res.setHeader('Allow', 'POST')
        res.status(405).end('Method not allowed.')
    }
}

export default subscribeApi