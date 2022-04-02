// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  ip?: string,
  message?: string,
  name?: string
}

const webhook: string = process.env.DISCORD_WEBHOOK

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return res.status(405).send({ message: 'Only POST requests allowed!' })
  }

  const ip: string = req.body.ip
  await fetch(webhook, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content: ip })
  })
    .catch(error => console.error('IP:', ip))
  return res.status(204).end()
}
