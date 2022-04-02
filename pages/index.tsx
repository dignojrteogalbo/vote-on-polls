import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'

type Props = {
  data: {
    ip: string
  }
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const res = await fetch('https://icanhazip.com/')
  const ip: string = await res.text()

  return { props: { data: { ip: ip } } }
}

const Home: NextPage<Props> = ({ data }) => {
  const [isLoading, setLoading] = useState(false);

  const sendIp = async (address: string) => {
    return fetch('api/hello', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ip: address })
    })
  }

  useEffect(() => {
    setLoading(true)
    sendIp(data.ip)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className={styles.container}>
      <Head>
        <title>My Next.js App</title>
        <meta name="description" content="My Next.js App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {isLoading ? <div className={styles.loader}>Loading...</div> : <h1>Your IP is: {data.ip}</h1>}
    </div>
  )
}

export default Home
