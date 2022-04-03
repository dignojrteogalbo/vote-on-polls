import type { NextPage, GetStaticProps, GetStaticPaths } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import styles from '../../styles/Vote.module.css'
import Choices from '../../components/Choices'

type Option = {
    description: string,
    emoji: string,
    votes: number
}

type Response = {
    title: string,
    author?: string,
    question?: string,
    firstOption: Option,
    secondOption: Option
}

const database = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL

const Vote: NextPage<Response> = (props) => {
    const router = useRouter()
    const { path } = router.query
    const [title, setTitle] = useState(props.title)
    const [author, setAuthor] = useState(props.author ? props.author : '')
    const [question, setQuestion] = useState(props.question ? props.question : '')
    const [firstOption, setFirstOption] = useState(props.firstOption)
    const [secondOption, setSecondOption] = useState(props.secondOption)

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(`${database}polls/${path}.json`)
            return res.json()
        }

        fetchData()
            .then(data => {
                setTitle(data.title)
                setAuthor(data.author ? data.author : '')
                setQuestion(data.question ? data.question : '')
                setFirstOption(data.firstOption)
                setSecondOption(data.secondOption)
            })
    }, [])

    return (
        <div className={styles.container}>
            <Head>
                <title>{question ? question: `Vote for ${title}`}</title>
                <meta name="description" content={question ? question : `Vote for ${title}`} />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <h1>{title}</h1>
            {author && <h3>Created by: {author}</h3>}
            {question && <h1>{question}</h1>}
            <Choices firstOption={firstOption} secondOption={secondOption} title={title}/>
        </div>
    )
}

export default Vote

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const res = await fetch(`${database}polls/${params?.path}.json`)
    const data = await res.json()

    if (!data) {
        return { notFound: true }
    }

    return { props: data, revalidate: 60 }
}

export const getStaticPaths: GetStaticPaths = async () => {
    const queries = await fetch(`${database}polls.json?shallow=true`)
        .then(res => res.json())
    const paths = Object.keys(queries).map(path => ({
        params: { path: path }
    }))

    return {
        paths,
        fallback: false
    }
}
