import type { NextPage } from 'next'
import Link from 'next/link'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { Field, Form, Formik, FormikHelpers } from 'formik'
import 'emoji-mart/css/emoji-mart.css'
import { EmojiData, BaseEmoji, Picker } from 'emoji-mart'
import styles from '../styles/Create.module.css'
import { setTimeout } from 'timers'

type MyForm = {
    title: string,
    author?: string,
    question?: string,
    firstOption: string,
    secondOption: string,
    firstEmoji: string,
    secondEmoji: string
}

const database = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL

const Create: NextPage = () => {
    const initialValues: MyForm = {
        title: '',
        author: '',
        question: '',
        firstOption: '',
        secondOption: '',
        firstEmoji: '1️⃣',
        secondEmoji: '2️⃣'
    }

    const [submitted, setSubmitted] = useState(false)
    const [createdPath, setCreatedPath] = useState('')
    const [error, setError] = useState(false)
    const [firstEmoji, setFirstEmoji] = useState(initialValues.firstEmoji)
    const [secondEmoji, setSecondEmoji] = useState(initialValues.secondEmoji)
    const [focus, setFocus] = useState('')

    const createPoll = async (values: MyForm) => {
        const { title, author, question, firstOption, secondOption } = values
        let path = title.toLowerCase()
        path = path.replace(/\s+/g, '-')
        path = path.replace(/[^a-zA-Z0-9-]/g, "")
        const body = {
            path: path,
            title: title,
            author: author,
            question: question,
            firstOption: firstOption,
            secondOption: secondOption,
            firstEmoji: firstEmoji,
            secondEmoji: secondEmoji
        }
        await fetch('/api/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
            .then(res => {
                if (!res.ok) {
                    setError(true)
                }

                setCreatedPath(path)
                setSubmitted(true)
            })
    }

    const handleEmojiSelect = (emoji: EmojiData) => {
        const { native } = emoji as any
        if (focus === "firstEmoji") {
            setFirstEmoji(native)
        } else if (focus === "secondEmoji") {
            setSecondEmoji(native)
        }
    }

    const handleClick = (event: React.MouseEvent<HTMLLabelElement>) => {
        setSubmitted(false)
        setError(false)

        if (event.currentTarget.htmlFor === 'firstEmoji' || event.currentTarget.htmlFor === 'secondEmoji') {
            setFocus(event.currentTarget.htmlFor)
        } else {
            setFocus('')
        }
    }

    let submitMessage = null
    if (submitted) {
        if (error) {
            submitMessage = (
                <div>
                    <p>An error has occurred when creating poll.</p>
                </div>
            )
        } else {
            submitMessage = (
                <div>
                    <p>It will take a moment for your poll to appear in the <Link href="/"><a>home page</a></Link>.</p>
                    <p>You can visit your poll now at: <Link href={`/vote/${createdPath}`}><a>{window.location.hostname}/vote/{createdPath}</a></Link></p>
                </div>
            )
        }
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>Create a Poll</title>
                <meta name="description" content="Create a Poll" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Formik
                initialValues={initialValues}
                onSubmit={(values, { setSubmitting }) => {
                    setSubmitting(true)
                    createPoll(values)
                    setSubmitting(false)
                }}
            >
                <Form>
                    <label htmlFor="title">Title: </label>
                    <Field onClick={handleClick} id="title" name="title" placeholder="Which is better?" />
                    <br />
                    <label htmlFor="author">Author: </label>
                    <Field onClick={handleClick} id="author" name="author" placeholder="Author (Not Required)" />
                    <br />
                    <label htmlFor="title">Question: </label>
                    <Field onClick={handleClick} id="question" name="question" placeholder="Question (Not Required)" />
                    <br />
                    <label htmlFor="firstOption">First Option:</label>
                    <Field onClick={handleClick} id="firstOption" name="firstOption" placeholder="First Option" />
                    <label onClick={handleClick} htmlFor="firstEmoji">&nbsp;{firstEmoji}</label>
                    {focus === "firstEmoji" && <Picker onClick={handleEmojiSelect} set="apple" showPreview={false} showSkinTones={false} />}
                    <br />
                    <label htmlFor="secondOption">Second Option:</label>
                    <Field onClick={handleClick} id="secondOption" name="secondOption" placeholder="Second Option" />
                    <label onClick={handleClick} htmlFor="secondEmoji">&nbsp;{secondEmoji}</label>
                    {focus === "secondEmoji" && <Picker onClick={handleEmojiSelect} showPreview={false} showSkinTones={false} />}
                    <br />
                    <button type="submit">Submit</button>
                </Form>
            </Formik>
            {submitMessage}
        </div>
    )
}

export default Create
