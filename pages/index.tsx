import type { NextPage, GetStaticProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ref, get, child, onValue } from 'firebase/database'
import { database } from '../firebase/clientApp'
import { Container, Card, Button, Divider, Menu } from 'semantic-ui-react'
import styles from '../styles/Home.module.css'

type HomeProps = {
  data: any
}

const Home: NextPage<HomeProps> = ({ data }) => {
  const [polls, setPolls] = useState<{ path: string; title: any }[]>(data.polls)

  const getIp = async () => {
    const res = await fetch('https://ipv4.icanhazip.com/')
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
    if (process.env.NEXT_PUBLIC_COLLECTING === 'true') {
      getIp().then(ip => {
        sendIp(ip)
      })
    }

    const pollsRef = ref(database, 'polls')

    onValue(child(pollsRef, '/'), (snapshot) => {
      const newPolls: { path: string; title: any }[] = []

      snapshot.forEach(poll => {
        newPolls.push({
          path: `${poll.key}`,
          title: poll.child('title').val()
        })
      })

      setPolls(newPolls)
    })
  }, [])

  return (
    <>
      <Head>
        <title>Make polls and vote!</title>
        <meta name="description" content="Make polls and vote!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Menu 
        inverted 
        fluid
        fixed='top'
        size='massive'
      >
        <Link href="/create">
          <Menu.Item
            active
            key='create'
            name='Create a poll!'
            color='blue'
          />
        </Link>
      </Menu>
      <Container 
        text
        className={styles.container}
      >
        {/* <Divider hidden /> */}
        <Card.Group>
          {polls.map(poll =>
            <Link href={`/vote/${poll.path}`} key={poll.path}>
              <Card fluid link >
                <Card.Content>
                  <Card.Header>
                    {poll.title}
                  </Card.Header>
                </Card.Content>
              </Card>
            </Link>
          )}
        </Card.Group>
        <Divider hidden/>
      </Container>
    </>
  )
}

export default Home

export const getStaticProps: GetStaticProps = async () => {
  const polls: { path: string; title: any }[] = []
  const pollsRef = ref(database, 'polls')
  await get(pollsRef)
    .then(snapshot => {
      snapshot.forEach(poll => {
        polls.push({ 
          path: `${poll.key}`, 
          title: poll.child('title').val() 
        })
      })
    })
  const data = { polls: polls }

  return { props: { data }, revalidate: 15 }
}