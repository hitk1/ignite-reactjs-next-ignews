import { GetServerSideProps } from "next"
import { getSession } from "next-auth/client"
import Head from 'next/head'
import { RichText } from "prismic-dom"
import { getPrismicClient } from "../../services/prismic"
import styles from './post.module.scss'

interface IProps {
    post: {
        slug: string
        title: string
        content: string
        updatedAt: string
    }
}

export default function Post({ post }: IProps) {
    return (
        <>
            <Head>
                <title>{post.title} | Ignews</title>
            </Head>
            <main className={styles.container}>
                <article className={styles.post}>
                    <h1>{post.title}</h1>
                    <time>{post.updatedAt}</time>
                    <div
                        className={styles.postContent}
                        dangerouslySetInnerHTML={{ __html: post.content }} />
                </article>
            </main>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
    const session = await getSession({ req })   //Recupera a sessão do usuário atraves do 'next-auth'
    const { slug } = params //parametros recebido por parâmetro, nome que esta entre colchetes do arquivo.

    if (!session?.activeSubscription) {
        //Retonar um redirect desta função para que ele seja redirecionado automaticamente pelo next
        return {
            redirect: {
                destination: '/',  //home
                permanent: false //importante setar como false (pois outros usuários podem estar logados)
            }
        }
    }

    const prismic = getPrismicClient()
    const response = await prismic.getByUID('post', String(slug), {})

    const post = {
        slug,
        title: RichText.asText(response.data.title),
        content: RichText.asHtml(response.data.content),
        updatedAt: new Date(response.last_publication_date).toLocaleDateString(
            'pt-BR',
            {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            }
        )
    }


    return {
        props: {
            post
        }
    }
}
