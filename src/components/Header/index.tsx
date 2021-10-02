import Image from 'next/image'
import { ActiveLink } from '../ActiveLink'
import { SignInButton } from '../SignInButton'
import styles from './styles.module.scss'

const Header: React.FC = () => {

    return (
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <Image src="/images/logo.svg" alt="ig.news" />
                <nav>
                    <ActiveLink
                        activeClassName={styles.active}
                        href="/">
                        <a>Home</a>
                    </ActiveLink>
                    <ActiveLink
                        activeClassName={styles.active}
                        href="/posts"
                    //prefetch => Esta opção diz ao framework do next pra deixar "pre-carergado" a pagina com todos os dados, isso facilita e aumenta a performance da aplicação
                    >
                        <a>Posts</a>
                    </ActiveLink>
                </nav>

                <SignInButton />
            </div>
        </header>
    )
}

export { Header }