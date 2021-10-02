import NextAuth from "next-auth"
import Providers from "next-auth/providers"
import { query as q } from 'faunadb'
import { faunaClient } from "../../../services/fauna"
import { session } from "next-auth/client"

export default NextAuth({
    // Configure one or more authentication providers
    providers: [
        Providers.GitHub({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            scope: 'read:user'
        }),
    ],
    // jwt: {
    //     signingKey: process.env.SIGNIN_KEY,
    // },
    callbacks: {
        async session(session) { //Callback do 'next-auth' que permite que a gente posso modificar os dados da sessão
            try {
                const { user: { email } } = session

                //Busca no faunaDB, a inscrição do usuario e esta, precisa estar ativa, caso contrário será gerado um erro.
                const userActiveSubscription = await faunaClient.query(
                    q.Get(
                        q.Intersection([
                            q.Match(
                                q.Index('find_subscription_by_user_ref'),
                                q.Select(
                                    'ref',
                                    q.Get(
                                        q.Match(
                                            q.Index('find_user_by_email'),
                                            q.Casefold(email)
                                        )
                                    )
                                )
                            ),
                            q.Match(
                                q.Index('find_subscription_by_status'),
                                'active'
                            )
                        ])
                    )
                )
                return {
                    ...session,
                    activeSubscription: userActiveSubscription
                }
            } catch {
                return {
                    ...session,
                    activeSubscription: null
                }
            }
        },
        async signIn(user, account, profile) {
            const { email } = user

            try {
                await faunaClient.query(
                    q.If(
                        q.Not(
                            q.Exists(
                                q.Match(
                                    q.Index('find_user_by_email'),
                                    q.Casefold(email)
                                )
                            )
                        ),
                        q.Create(
                            q.Collection('users'),
                            { data: { email } }
                        ),
                        q.Get(
                            q.Match(
                                q.Index('find_user_by_email'),
                                q.Casefold(email)
                            )
                        ),
                    )
                )
                return true
            } catch {
                return false
            }
        }
    }
})