import React, { FunctionComponent, useContext, useEffect, useState } from 'react'
import styles from './Choices.module.css'
import { PollContext } from '../pages/vote/[path]';
import { database } from '../firebase/clientApp';
import { ref, onValue, child } from 'firebase/database';

type ChoicesProps = {
    canCastVote: boolean
    voteActivity: () => void,
}

const Choices: FunctionComponent<ChoicesProps> = ({ canCastVote, voteActivity }) => {
    const { poll, path } = useContext(PollContext)
    const [firstOptionVotes, setFirstOptionVotes] = useState(poll.firstOption.votes)
    const [secondOptionVotes, setSecondOptionVotes] = useState(poll.secondOption.votes)

    const castVote = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        let route = event.currentTarget.name
        const body = {
            path: path,
            route: route
        }
        await fetch('/api/vote', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        })
        voteActivity()
    }

    useEffect(() => {
        const pollsRef = ref(database, 'polls')

        onValue(child(pollsRef, `${path}/firstOption/votes`), (snapshot) => {
            setFirstOptionVotes(snapshot.val())
        })

        onValue(child(pollsRef, `${path}/secondOption/votes`), (snapshot) => {
            setSecondOptionVotes(snapshot.val())
        })
    }, [])

    return(
        <div className={styles.container}>
            <div className={styles.applyBlur}>
                <button
                    name='firstOption'
                    disabled={!canCastVote}
                    className={`${styles.voteButton} ${styles.firstOption}`}
                    onClick={castVote}
                >
                    {poll.firstOption.emoji}
                </button>
                <div className={styles.voteContent}>{poll.firstOption.description}<br />{firstOptionVotes}</div>
            </div>
            <div className={styles.applyBlur}>
                <button
                name='secondOption'
                    disabled={!canCastVote}
                    className={`${styles.voteButton} ${styles.secondOption}`}
                    onClick={castVote}
                >
                    {poll.secondOption.emoji}
                </button>
                <div className={styles.voteContent}>{poll.secondOption.description}<br />{secondOptionVotes}</div>
            </div>
        </div>
    )
}

export default Choices