import React, { useState, FunctionComponent, useEffect } from 'react'
import { ref, onValue } from 'firebase/database'
import { database } from '../firebase/clientApp'
import Cookies from 'universal-cookie';
import styles from './styles/Choices.module.css'

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
        let route = event.currentTarget.className
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
        <div>
            <button
                disabled={!canCastVote}
                className='firstOption'
                key={1} 
                onClick={castVote}
            >
                <p>{firstOption.description}, {firstOption.emoji}, {firstOptionVotes}</p>
            </button>
            <button
                disabled={!canCastVote}
                className='secondOption'
                key={2} 
                onClick={castVote}
            >
                <p>{secondOption.description}, {secondOption.emoji}, {secondOptionVotes}</p>
            </button>
        </div>
    )
}

export default Choices