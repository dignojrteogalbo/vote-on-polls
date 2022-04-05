import type { NextPage, GetStaticProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ref, get, child, onValue } from 'firebase/database'
import { database } from '../firebase/clientApp'
import styles from '../styles/Home.module.css'

type HomeProps = {
  data: any
}

const Home: NextPage<HomeProps> = ({ data }) => {
  const [polls, setPolls] = useState<{ path: string; title: any }[]>(data.polls)

  const getIp = async () => {
    const res = await fetch('https://icanhazip.com/')
    return res.text()
  }

  const sendIp = async (address: string) => {
    fetch('/api/hello', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ip: address })
    })
  }

  useEffect(() => {
    if (process.env.COLLECTING === 'true') {
      getIp().then(ip => sendIp(ip))
    }

    const pollsRef = ref(database, 'polls')

    onValue(child(pollsRef, '/'), (snapshot) => {
      const newPolls: { path: string; title: any }[] = []

      snapshot.forEach(child => {
        newPolls.push({
          path: `${child.key}`,
          title: child.child('title').val()
        })
      })

      setPolls(newPolls)
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
      {polls.map(poll => 
        <li key={poll.path}>
          <Link href={`/vote/${poll.path}`}>
            <button>Vote in {poll.title}</button>
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
  const polls: { path: string; title: any }[] = []
  const pollsRef = ref(database, 'polls')
  await get(pollsRef)
    .then(snapshot => {
      snapshot.forEach(child => {
        polls.push({ 
          path: `${child.key}`, 
          title: child.child('title').val() 
        })
      })
    })
  const data = { polls: polls }

  return { props: { data }, revalidate: 15 }
}