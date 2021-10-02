import { GetStaticPaths, GetStaticProps } from "next"
import { useSession } from "next-auth/client"
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from "next/router"
import { RichText } from "prismic-dom"
import { useEffect } from "react"

import { getPrismicClient } from "../../../services/prismic"
import styles from '../post.module.scss'

interface IProps {
    post: {
        slug: string
        title: string
        content: string
        updatedAt: string
    }
}

export default function PostPreview({ post }: IProps) {
    const [session] = useSession()
    const router = useRouter()

    useEffect(() => {
        if (session?.activeSubscription) {
            router.push(`/posts/${post.slug}`)
            return
        }
    }, [session, router, post.slug])
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
                        className={`${styles.postContent} ${styles.previewContent}`}
                        dangerouslySetInnerHTML={{ __html: post.content }} />

                    <div className={styles.continueReading}>
                        Wanna continue reading?
                        <Link href="/">
                            <a>Subscribe now</a>
                        </Link>
                    </div>
                </article>
            </main>
        </>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    /*
        o attrs 'paths' quando informado como um array vazio, indicara que as paginas serão geradas de acordo
        com o acesso, ou seja, nenhum pagina sera gerada de forma estática no build.
        Se for necessário ter alguma pagina gerada de forma estática no build, deve ser informado dentro do array:

        paths: [
            params: {
                [paramName (no caso é 'slug')]: 'id do conteúdo'
            }
        ]
    */
    return {
        paths: [],
        fallback: 'blocking' //Define que o conteúdo html, só sera mostrado quando estiver pronto (dados carregados, etc;)
    }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const { slug } = params //parametros recebido por parâmetro, nome que esta entre colchetes do arquivo.


    const prismic = getPrismicClient()
    const response = await prismic.getByUID('post', String(slug), {})

    const post = {
        slug,
        title: RichText.asText(response.data.title),
        content: RichText.asHtml(response.data.content.splice(0, 3)),
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
        },
        revalidate: 60 * 30
    }
}
