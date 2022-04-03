import type { NextPage } from 'next'
import { useRouter } from "next/router"
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { Field, Form, Formik, FormikHelpers } from 'formik'
import 'emoji-mart/css/emoji-mart.css'
import { EmojiData, BaseEmoji, Picker } from 'emoji-mart'
import styles from '../styles/Create.module.css'

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
    const router = useRouter()

    const initialValues: MyForm = {
        title: '',
        author: '',
        question: '',
        firstOption: '',
        secondOption: '',
        firstEmoji: '1️⃣',
        secondEmoji: '2️⃣'
    }

    const [firstEmoji, setFirstEmoji] = useState(initialValues.firstEmoji)
    const [secondEmoji, setSecondEmoji] = useState(initialValues.secondEmoji)
    const [focus, setFocus] = useState('')

    const createPoll = async (values: MyForm) => {
        const { title, author, question, firstOption, secondOption } = values
        let path = title.toLowerCase()
        path = path.replace(/[^a-zA-Z0-9]/g, "")
        path = path.replace(/\s+/g, '-')
        const body = {
            title: title,
            author: author,
            question: question,
            firstOption: {
                description: firstOption,
                emoji: firstEmoji,
                votes: 0
            },
            secondOption: {
                description: secondOption,
                emoji: secondEmoji,
                votes: 0
            }
        }
        await fetch(`${database}polls/${path}.json`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
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
        if (event.currentTarget.htmlFor === 'firstEmoji' || event.currentTarget.htmlFor === 'secondEmoji') {
            setFocus(event.currentTarget.htmlFor)
        } else {
            setFocus('')
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
                    router.push('/')
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
        </div>
    )
}

export default Create
