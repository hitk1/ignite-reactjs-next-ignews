import { signIn, useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import { api } from '../../services/api'
import { getStripeJs } from '../../services/stripe-js'
import styles from './styles.module.scss'

const SubscribeButton: React.FC = () => {
    const [session] = useSession()
    const router = useRouter()

    const handleSubscribe = async () => {
        if (!session) {
            signIn('github')
            return
        }

        if (session.activeSubscription) {
            router.push('/posts')
            return
        }

        const stripe = await getStripeJs()
        try {
            const response = await api.post('/subscribe')

            const { sessionId } = response.data
            await stripe.redirectToCheckout({ sessionId })
        } catch (error) {
            alert(error.message)
        }
    }

    return (
        <button
            type="button"
            className={styles.subscribeButton}
            onClick={handleSubscribe}
        >
            Subscribe Now
        </button>
    )
}

export { SubscribeButton }