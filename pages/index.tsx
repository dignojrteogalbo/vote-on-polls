import type { NextPage, GetStaticProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'

type Response = {
  data: string[]
}

const database = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL

const Home: NextPage<Response> = (props) => {
  const { data } = props
  const [polls, setPolls] = useState<string[]>([])

  const getIp = async () => {
    const res = await fetch('https://icanhazip.com/')
    return res.text()
  }

  const sendIp = async (address: string) => {
    fetch('api/hello', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ip: address })
    })
  }

  useEffect(() => {
    const getPolls = Object.keys(data)
    setPolls(getPolls)
    getIp()
      .then(ip => {
        sendIp(ip)
      })
  }, [])

  return (
    <div className={styles.container}>
      <Head>
        <title>My Next.js App</title>
        <meta name="description" content="My Next.js App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ul>
      {polls.map(path => 
        <li>
          <Link href={`/vote/${path}`}>
            <button>Vote in {path}</button>
          </Link>
        </li>
      )}
      </ul>
      <br />
      <Link href="/create">
        <button>Create a poll!</button>
      </Link>
    </div>
  )
}

export default Home

export const getStaticProps: GetStaticProps = async () => {
  const res = await fetch(`${database}polls.json?shallow=true`)
  const data = await res.json()

  return { props: { data }, revalidate: 60 }
}