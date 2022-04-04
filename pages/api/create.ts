// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
    message?: string
    error?: string
}

const database = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method !== 'POST') {
        return res.status(405).send({ message: 'Only POST requests allowed!' })
    }

    const { path, title, author, question, firstOption, secondOption, firstEmoji, secondEmoji } = req.body
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
        .then(db => {
            if (!db.ok) {
                return res.status(db.status).json({ error: db.statusText })
            }

            return res.status(db.status).json({ message: db.statusText })
        })
}
