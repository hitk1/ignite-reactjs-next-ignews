import Head from 'next/head'
import React from 'react'
import styles from './styles.module.scss'

export default function Posts() {
    return (
        <>
            <Head>
                <title> Posts | Ignews</title>
            </Head>

            <main className={styles.container}>
                <div className={styles.posts}>
                    <a href="">
                        <time>25 de agosto de 2021</time>
                        <strong>Creating a Monorepo with Lerna and Yarn workspaces</strong>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque optio quasi architecto officia eum modi dolorem natus! Ipsam facere vero laudantium! Ipsum, pariatur dolorum soluta tempore voluptas veniam voluptatem veritatis!</p>
                    </a>
                    <a href="">
                        <time>25 de agosto de 2021</time>
                        <strong>Creating a Monorepo with Lerna and Yarn workspaces</strong>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque optio quasi architecto officia eum modi dolorem natus! Ipsam facere vero laudantium! Ipsum, pariatur dolorum soluta tempore voluptas veniam voluptatem veritatis!</p>
                    </a>
                    <a href="">
                        <time>25 de agosto de 2021</time>
                        <strong>Creating a Monorepo with Lerna and Yarn workspaces</strong>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque optio quasi architecto officia eum modi dolorem natus! Ipsam facere vero laudantium! Ipsum, pariatur dolorum soluta tempore voluptas veniam voluptatem veritatis!</p>
                    </a>
                    <a href="">
                        <time>25 de agosto de 2021</time>
                        <strong>Creating a Monorepo with Lerna and Yarn workspaces</strong>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque optio quasi architecto officia eum modi dolorem natus! Ipsam facere vero laudantium! Ipsum, pariatur dolorum soluta tempore voluptas veniam voluptatem veritatis!</p>
                    </a>
                </div>
            </main>
        </>
    )
}