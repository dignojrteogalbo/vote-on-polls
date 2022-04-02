import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  const [isLoading, setLoading] = useState(false);

  const getIp = async () => {
    return fetch('https://icanhazip.com/')
  }

  const sendIp = async (data: string) => {
    fetch('api/hello', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ip: data })
    })
  }

  useEffect(() => {
    setLoading(true)
    getIp()
      .then(res => res.text())
      .then(data => {
        sendIp(data)
      })
      .finally(() => setLoading(false))
      .catch(error => console.error(error))
  }, [])

  return (
    <div className={styles.container}>
      <Head>
        <title>My Next.js App</title>
        <meta name="description" content="My Next.js App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {isLoading ? <div className={styles.loader}>Loading...</div> : <h1>Done Loading!</h1>}
    </div>
  )
}

export default Home
