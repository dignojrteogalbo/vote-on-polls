import type { NextPage, GetStaticProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { ref, get } from 'firebase/database'
import { database } from '../firebase/clientApp'
import { Container, Card, Divider } from 'semantic-ui-react'
import styles from '../styles/Home.module.css'
import { Navbar } from '../components/Navbar'

type HomeProps = {
  data: {
    polls: Poll[]
  }
}

type Poll = {
  path: string,
  title: string
}

const Home: NextPage<HomeProps> = ({ data }) => {
  const [polls, setPolls] = useState<Poll[]>(data.polls)
  const navbarItems = [
    { path: '/create', content: 'Create a poll!' }
  ]

  return (
    <>
      <Head>
        <title>Make polls and vote!</title>
        <meta name="description" content="Make polls and vote!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar items={navbarItems} />
      <Container 
        text
        className={styles.container}
      >
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
  const polls: { path: string; title: string }[] = []
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