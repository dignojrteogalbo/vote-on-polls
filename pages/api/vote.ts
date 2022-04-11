import type { NextApiRequest, NextApiResponse } from 'next'
import { increment, ref, update } from 'firebase/database'
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
        return res.status(405).send({ message: 'Only POST requests allowed!' })
    }

    const { path, route } = req.body
    const votesRef = ref(database, `polls/${path}/${route}`)
    await update(votesRef, {
        votes: increment(1)
    })
    return res.status(204).end()
}
