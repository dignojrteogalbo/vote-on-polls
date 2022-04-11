import type { NextPage, GetStaticProps, GetStaticPaths } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useEffect, useState, createContext } from 'react'
import Choices from '../../components/Choices'
import { ref, get, child } from 'firebase/database'
import { database } from '../../firebase/clientApp'
import Cookies from 'universal-cookie';
import styles from '../../styles/Vote.module.css'
import { Poll } from './poll'
import { Navbar } from '../../components/Navbar'

const initialPoll: Poll = {
    title: '',
    firstOption: {
        description: '',
        emoji: '',
        votes: 0
    },
    secondOption: {
        description: '',
        emoji: '',
        votes: 0
    }
}

type VoteProps = {
    data: any
}

export const PollContext = createContext({
    poll: initialPoll,
    path: ''
})

const cookies = new Cookies();

const Vote: NextPage<VoteProps> = ({ data }) => {
    const router = useRouter()
    const path = `${router.query.path}`
    const [canCastVote, setCanCastVote] = useState(true)

    useEffect(() => {
        setCanCastVote(!cookies.get(`/vote/${path}`))
    }, [])

    const oneDay = 1000 * 60 * 60 * 24
    const voteActivity = () => {
        const expiry = new Date(Date.now() + oneDay)
        cookies.set(`/vote/${path}`, true, { expires: expiry })
        setCanCastVote(!cookies.get(`/vote/${path}`))
    }

    return (
        <PollContext.Provider value={{ poll: data, path: path }}>
            <Head>
                <title>{data.question ? data.question: `Vote between ${data.firstOption.description} or ${data.secondOption.description}`}</title>
                <meta name="description" content={`${data.title}\nVote between ${data.firstOption.description} or ${data.secondOption.description}\n${data.question}`} />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Navbar home />
            <div className={styles.info}>
                <h1>{data.title}</h1>
                {data.author && <h3>Created by: {data.author}</h3>}
                {data.question && <h1>{data.question}</h1>}
                {!canCastVote && <p>You have already voted for this poll today.</p>}
            </div>
            <Choices canCastVote={canCastVote} voteActivity={voteActivity} />
        </PollContext.Provider>
    )
}

export default Vote

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const path = `${params?.path}`
    const pollsRef = ref(database, `polls`)
    let notFound = false
    let data = {}
    await get(child(pollsRef, path))
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

    return { props: { data: data }, revalidate: 15 }
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
