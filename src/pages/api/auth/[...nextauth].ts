import NextAuth from "next-auth"
import Providers from "next-auth/providers"
import { query as q } from 'faunadb'
import { faunaClient } from "../../../services/stripe/fauna"

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