import { signIn, useSession } from 'next-auth/client'
import styles from './styles.module.scss'

interface IProps {
    priceId: string
}

const SubscribeButton: React.FC<IProps> = ({ priceId }) => {
    const [session] = useSession()

    const handleSubscribe = () => {
        if (!session) {
            signIn('github')
            return
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