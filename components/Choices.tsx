import React, { FunctionComponent, useContext } from 'react'
import styles from './Choices.module.css'
import { PollContext } from '../pages/vote/[path]';

type ChoicesProps = {
    canCastVote: boolean
    voteActivity: () => void,
}

const Choices: FunctionComponent<ChoicesProps> = ({ canCastVote, voteActivity }) => {
    const { poll, path } = useContext(PollContext)

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
                <div className={styles.voteContent}>{poll.firstOption.description}<br />{poll.firstOption.votes}</div>
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
                <div className={styles.voteContent}>{poll.secondOption.description}<br />{poll.secondOption.votes}</div>
            </div>
        </div>
    )
}

export default Choices