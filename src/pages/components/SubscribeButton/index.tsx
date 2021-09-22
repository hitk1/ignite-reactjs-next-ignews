import { signIn, useSession } from 'next-auth/client'
import { api } from '../../../services/api'
import { getStripeJs } from '../../../services/stripe-js'
import styles from './styles.module.scss'

interface IProps {
    priceId: string
}

const SubscribeButton: React.FC<IProps> = ({ priceId }) => {
    const [session] = useSession()

    const handleSubscribe = async () => {
        if (!session) {
            signIn('github')
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