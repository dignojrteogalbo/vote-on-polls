// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  ip?: string,
  message?: string,
  name?: string
}

const discord: string = 'https://discord.com/api/webhooks/793705181316513793/0HqP78fT8nJWbnIENYBNpnOve6Ue95mo7ubcX-_LB8r6_dRuPP2_ZdmVhIqdaFXqCTxb'

export default function handler(
  req: NextApiRequest, 
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return res.status(405).send({ message: 'Only POST requests allowed!' })
  }

  const ip: string = req.body.ip
  fetch(discord, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content: ip })
  })
  return res.status(204).end()
}
