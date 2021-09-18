import styles from './styles.module.scss'

interface IProps {
    priceId: string
}

const SubscribeButton: React.FC<IProps> = ({ priceId }) => {
    return (
        <button
            type="button"
            className={styles.subscribeButton}
        >
            Subscribe Now
        </button>
    )
}

export { SubscribeButton }