import type { NextApiRequest, NextApiResponse } from 'next'
import { ref, set } from 'firebase/database'
import { database } from '../../firebase/clientApp'

type Data = {
    message?: string
    error?: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method !== 'POST') {
        return res.status(405).send({ error: 'Only POST requests allowed!' })
    }

    const { path, title, author, question, firstOption, secondOption, firstEmoji, secondEmoji } = req.body
    const body = {
        title: title,
        author: author ?? '',
        question: question ?? '',
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

    const newPollRef = ref(database, `polls/${path}`)
    await set(newPollRef, body)
        .then(() => { return res.status(201).send({ message: 'successfully created poll' }) })
        .catch(err => { return res.status(401).send({ error: err.code }) })
}
