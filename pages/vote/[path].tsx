import type { NextPage, GetStaticProps, GetStaticPaths } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Choices from '../../components/Choices'
import { ref, get, child, DatabaseReference } from 'firebase/database'
import { database } from '../../firebase/clientApp'
import Cookies from 'universal-cookie';
import styles from '../../styles/Vote.module.css'

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

const cookies = new Cookies();

const Vote: NextPage<Response> = (props) => {
    const router = useRouter()
    const { path } = router.query
    const [title, setTitle] = useState(props.title)
    const [author, setAuthor] = useState(props.author ? props.author : '')
    const [question, setQuestion] = useState(props.question ? props.question : '')
    const [firstOption, setFirstOption] = useState(props.firstOption)
    const [secondOption, setSecondOption] = useState(props.secondOption)
    const [canCastVote, setCanCastVote] = useState(true)

    useEffect(() => {
        const getPollData = async (ref: DatabaseReference, path: string) => {
            await get(child(ref, path))
                .then(snapshot => {
                    if (snapshot.exists()) {
                        const data = snapshot.val()
                        setTitle(data.title)
                        setAuthor(data.author)
                        setQuestion(data.question)
                        setFirstOption(data.firstOption)
                        setSecondOption(data.secondOption)
                    }
                })
                .catch(err => console.error(err))
        }

        const pollsRef = ref(database, `polls`)
        getPollData(pollsRef, `${path}`)
        setCanCastVote(!cookies.get(`/vote/${path}`))
    }, [])

    const oneDay = 1000 * 60 * 60 * 24
    const voteActivity = () => {
        const expiry = new Date(Date.now() + oneDay)
        cookies.set(`/vote/${path}`, true, { expires: expiry })
        setCanCastVote(!cookies.get(`/vote/${path}`))
    }

    return (
        <>
            <Head>
                <title>{question ? question: `Vote for ${title}`}</title>
                <meta name="description" content={question ? question : `Vote for ${title}`} />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className={styles.info}>
                <h1>{title}</h1>
                {author && <h3>Created by: {author}</h3>}
                {question && <h1>{question}</h1>}
                {!canCastVote && <p>You have already voted for this poll today.</p>}
            </div>
            <Choices
                canCastVote={canCastVote}
                firstOption={firstOption} 
                secondOption={secondOption} 
                voteActivity={voteActivity} 
                path={path}
            />
        </>
    )
}

export default Vote

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const path = params?.path
    const pollsRef = ref(database, `polls`)
    let notFound = false
    let data = {}
    await get(child(pollsRef, `${path}`))
        .then(snapshot => {
            if (snapshot.exists()) {
                data = snapshot.val()
            } else {
                notFound = true
                console.log('not found')
            }
        })
        .catch(err => {
            console.error(err)
            notFound = true
        })

    if (notFound) {
        return { notFound: true }
    }

    return { props: data, revalidate: 15 }
}

export const getStaticPaths: GetStaticPaths = async () => {
    const queries = await fetch(`${process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL}polls.json?shallow=true`)
        .then(res => res.json())
    const paths = Object.keys(queries).map(path => ({
        params: { path: path }
    }))

    return {
        paths,
        fallback: 'blocking'
    }
}
