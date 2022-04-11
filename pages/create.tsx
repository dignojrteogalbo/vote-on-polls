import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import React, { createContext, useEffect, useState } from 'react'
import { Container, Menu, Segment } from 'semantic-ui-react'
import styles from '../styles/Create.module.css'
import 'emoji-mart/css/emoji-mart.css'
import PollForm from '../components/PollForm'

export type MyFormProps = {
    path: string,
    title: string,
    author?: string,
    question?: string,
    firstOption: string,
    firstEmoji: string,
    secondOption: string,
    secondEmoji: string
}

export const FormContext = createContext({
    loading: false,
    fail: false
})

const Create: NextPage = () => {
    const [loading, setLoading] = useState(false)
    const [createdPath, setCreatedPath] = useState('')
    const [fail, setFail] = useState(false)

    const value = { loading, fail }

    const createPoll = async (body: MyFormProps) => {
        setLoading(true)
        await fetch('/api/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
            .then(res => {
                if (res.ok) {
                    setCreatedPath(body.path)
                    setFail(false)
                } else {
                    setFail(true)
                }

                setLoading(false)
            })
    }

    return (
        <>
            <Head>
                <title>Create a Poll</title>
                <meta name="description" content="Create a Poll" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Menu
                inverted
                fluid
                fixed='top'
                size='massive'
            >
                <Link href="/">
                    <Menu.Item
                        active
                        key='home'
                        name='Go to home!'
                        color='blue'
                    />
                </Link>
            </Menu>
            <Container className={styles.container}>
                <FormContext.Provider value={value}>
                    <PollForm 
                        createPoll={createPoll} 
                        className={styles.form} 
                        disabled={createdPath != ''}
                    />
                </FormContext.Provider>
                {createdPath && !loading &&
                    <Segment raised>
                        <p>It will take a moment for your poll to appear in the <Link href="/"><a>home page</a></Link>.</p>
                        <p>You can visit your poll now at: <Link href={`/vote/${createdPath}`}><a>{window.location.hostname}/vote/{createdPath}</a></Link></p>
                    </Segment>
                }
            </Container>
        </>
    )
}

export default Create
