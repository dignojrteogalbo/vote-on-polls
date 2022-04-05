import React, { useState, FunctionComponent, useEffect, CSSProperties } from 'react'
import { ref, onValue } from 'firebase/database'
import { database } from '../firebase/clientApp'
import Cookies from 'universal-cookie';
import styles from './Choices.module.css'

type Option = {
    description: string,
    emoji: string,
    votes: number
}

type ChoicesProps = {
    canCastVote: boolean
    firstOption: Option,
    secondOption: Option,
    voteActivity: () => void,
    path: string | string[] | undefined
}

const cookies = new Cookies();

const Choices: FunctionComponent<ChoicesProps> = ({ canCastVote, firstOption, secondOption, voteActivity, path }) => {
    const [firstOptionVotes, setFirstOptionVotes] = useState(firstOption.votes)
    const [secondOptionVotes, setSecondOptionVotes] = useState(secondOption.votes)
    const [choice, setChoice] = useState(0)

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
        const firstRef = ref(database, `polls/${path}/firstOption/votes`)
        const secondRef = ref(database, `polls/${path}/secondOption/votes`)

        onValue(firstRef, (snapshot) => {
            const data = snapshot.val();
            setFirstOptionVotes(data)
        })

        onValue(secondRef, (snapshot) => {
            const data = snapshot.val();
            setSecondOptionVotes(data)
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
                    {firstOption.emoji}
                </button>
                <div className={styles.voteContent}>{firstOption.description}<br />{firstOptionVotes}</div>
            </div>
            <div className={styles.applyBlur}>
                <button
                name='secondOption'
                    disabled={!canCastVote}
                    className={`${styles.voteButton} ${styles.secondOption}`}
                    onClick={castVote}
                >
                    {secondOption.emoji}
                </button>
                <div className={styles.voteContent}>{secondOption.description}<br />{secondOptionVotes}</div>
            </div>
        </div>
    )
}

export default Choices